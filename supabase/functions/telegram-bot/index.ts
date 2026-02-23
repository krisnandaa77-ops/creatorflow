import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Bot States
const STATE_IDLE = 'IDLE'
const STATE_IDEA_TITLE = 'IDEA_TITLE'
const STATE_IDEA_REF = 'IDEA_REF'
const STATE_IDEA_DESC = 'IDEA_DESC'
const STATE_TODO_TITLE = 'TODO_TITLE'
const STATE_TODO_DATE = 'TODO_DATE'

// Main Keyboard Layout
const MAIN_KEYBOARD = {
    keyboard: [
        [{ text: "💡 Add Content Idea" }, { text: "✅ Add To-Do" }],
        [{ text: "ℹ️ Info Command" }, { text: "🌐 Website CreatorFlow" }]
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
    is_persistent: true
}

Deno.serve(async (req) => {
    // 1. Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const body = await req.json()
        console.log("Received Webhook Body:", JSON.stringify(body))

        const update = body
        const message = update.message

        // 2. Initialize Supabase
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

        if (!supabaseUrl || !supabaseKey) {
            console.error("Missing Supabase credentials")
            throw new Error("Missing Supabase credentials")
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        // 3. Handle Text Messages
        if (message && message.text) {
            console.log("Processing Message:", message.text, "from:", message.chat.id)
            await handleMessage(supabase, message)
            return new Response(JSON.stringify({ message: 'ok' }), { headers: corsHeaders, status: 200 })
        }

        return new Response(JSON.stringify({ message: 'ignored' }), { headers: corsHeaders, status: 200 })

    } catch (error) {
        console.error('CRITICAL ERROR processing request:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    }
})

// --- Logic Handlers ---

async function handleMessage(supabase: any, message: any) {
    try {
        const chatId = message.chat.id
        const text = message.text
        const telegramId = message.from.id

        // --- 1. GLOBAL COMMANDS & MENU BUTTONS ---
        // These keys override any current session state

        if (text === '/start' || text === '/menu') {
            await handleGlobalCommand(supabase, chatId, telegramId, text)
            return
        }

        if (text === "💡 Add Content Idea") {
            const { user, profile } = await getProfile(supabase, telegramId)
            if (!profile) return await promptLinking(chatId)

            await updateSession(supabase, profile.id, { state: STATE_IDEA_TITLE, step_data: {} })
            await sendMessage(chatId, "💡 *New Content Idea*\n\nWhat is the **Title** of your idea?")
            return
        }

        if (text === "✅ Add To-Do") {
            const { user, profile } = await getProfile(supabase, telegramId)
            if (!profile) return await promptLinking(chatId)

            await updateSession(supabase, profile.id, { state: STATE_TODO_TITLE, step_data: {} })
            await sendMessage(chatId, "✅ *New To-Do Task*\n\nWhat is the **Task Name**?")
            return
        }

        if (text === "ℹ️ Info Command") {
            await sendMessage(chatId,
                "ℹ️ *CreatorFlow Bot Info*\n\n" +
                "I help you capture ideas and manage tasks quickly.\n\n" +
                "• **Add Content Idea**: Save title, link, and description.\n" +
                "• **Add To-Do**: Add a quick task with a deadline.\n" +
                "• **Web Dashboard**: View all your items online."
            )
            return
        }

        if (text === "🌐 Website CreatorFlow") {
            await sendMessage(chatId, "🌐 Access your dashboard here:\nhttps://creatorflow-puce.vercel.app")
            return
        }

        // --- 2. ACCOUNT LINKING ---
        if (text.startsWith('/start CF-')) {
            await handleLinking(supabase, chatId, text)
            return
        }

        // --- 3. CONVERSATIONAL STATE MACHINE ---
        const { profile } = await getProfile(supabase, telegramId)
        if (!profile) {
            await promptLinking(chatId)
            return
        }

        const session = profile.bot_session || { state: STATE_IDLE, step_data: {} }
        const state = session.state
        console.log("Current State:", state)

        if (state === STATE_IDLE) {
            // If idle and typing random text (not a command), showing menu
            await sendMenu(chatId, "Please choose an option from the menu below:")
            return
        }

        // --- IDEA FLOW ---
        if (state === STATE_IDEA_TITLE) {
            const stepData = { ...session.step_data, title: text }
            await updateSession(supabase, profile.id, { state: STATE_IDEA_REF, step_data: stepData })
            await sendMessage(chatId, "🔗 Great! Do you have a **Reference Link**?\n(Type 'no' or skip if none)")
        }
        else if (state === STATE_IDEA_REF) {
            const link = (text.toLowerCase() === 'no' || text.toLowerCase() === 'skip') ? '' : text
            const stepData = { ...session.step_data, reference_link: link }
            await updateSession(supabase, profile.id, { state: STATE_IDEA_DESC, step_data: stepData })
            await sendMessage(chatId, "📝 Almost done! Add a short **Description**:\n(Type 'no' to skip)")
        }
        else if (state === STATE_IDEA_DESC) {
            const desc = (text.toLowerCase() === 'no' || text.toLowerCase() === 'skip') ? '' : text
            const finalData = { ...session.step_data, description: desc }

            // INSERT INTO 'contents' (Idea)
            const { error: insertError } = await supabase.from('contents').insert({
                user_id: profile.id,
                title: finalData.title,
                reference_link: finalData.reference_link,
                description: finalData.description,
                status: 'Idea',
                platform: 'Instagram' // Default valid platform
            })

            if (insertError) {
                console.error("Error inserting Idea:", insertError)
                await sendMessage(chatId, `❌ Failed to save idea.\nError: ${insertError.message || JSON.stringify(insertError)}`)
            } else {
                await updateSession(supabase, profile.id, null) // Clear session
                await sendMessage(chatId, `🎉 **Idea Saved!**\n\nTitle: ${finalData.title}`)
            }
        }

        // --- TO-DO FLOW ---
        else if (state === STATE_TODO_TITLE) {
            const stepData = { ...session.step_data, task_name: text }
            await updateSession(supabase, profile.id, { state: STATE_TODO_DATE, step_data: stepData })
            await sendMessage(chatId, "📅 When is the **Deadline**?\n(e.g., 'Tomorrow', '2023-12-31', or 'None')")
        }
        else if (state === STATE_TODO_DATE) {
            const deadline = (text.toLowerCase() === 'none') ? null : text

            let validDate = null
            if (deadline && !isNaN(Date.parse(deadline))) {
                validDate = new Date(deadline).toISOString()
            }

            const finalData = { ...session.step_data }

            // INSERT INTO 'daily_todos'
            const { error: insertError } = await supabase.from('daily_todos').insert({
                user_id: profile.id,
                task_name: finalData.task_name,
                due_date: validDate,
                is_completed: false
            })

            if (insertError) {
                console.error("Error inserting To-Do:", insertError)
                await sendMessage(chatId, `❌ Failed to save To-Do.\nError: ${insertError.message || JSON.stringify(insertError)}`)
            } else {
                await updateSession(supabase, profile.id, null)
                await sendMessage(chatId, `✅ **To-Do Added!**\n\nTask: ${finalData.task_name}`)
            }
        }

    } catch (e) {
        console.error("Error in handleMessage:", e)
        await sendMessage(message.chat.id, "❌ An error occurred processing your message.")
    }
}


// --- Helper Functions ---

async function handleGlobalCommand(supabase: any, chatId: number, telegramId: number, text: string) {
    console.log("Handling Global Command:", text)
    const { profile } = await getProfile(supabase, telegramId)

    if (profile) {
        // Reset session on start/menu
        await updateSession(supabase, profile.id, null)
        await sendMenu(chatId, `Welcome back, ${profile.full_name}! Select an option:`)
    } else {
        await sendMessage(chatId, "👋 Welcome! To use this bot, please link your account from the web app.")
    }
}

async function handleLinking(supabase: any, chatId: number, text: string) {
    console.log("Handling Linking:", text)
    const tokenToken = text.split(' ')[1]
    const token = tokenToken ? tokenToken.trim().toUpperCase() : ''

    if (!token.startsWith('CF-')) {
        await sendMessage(chatId, "❌ Invalid token format.")
        return
    }

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('linking_token', token)
        .single()

    if (error || !profile) {
        console.error("Linking Error or Profile Not Found:", error)
        await sendMessage(chatId, "❌ Invalid or expired token.")
        return
    }

    const { error: updateError } = await supabase.from('profiles').update({
        telegram_id: chatId,
        linking_token: null,
        bot_session: null
    }).eq('id', profile.id)

    if (updateError) {
        console.error("Error updating profile for linking:", updateError)
        await sendMessage(chatId, "❌ Failed to link account (DB Error).")
        return
    }

    // New Branded Success Message
    const successMsg =
        `✅ **Akun Berhasil Terhubung!** Selamat datang di ekosistem **CreatorFlow**, ${profile.full_name}.

Ide dan tugasmu sekarang akan tersinkronisasi otomatis dengan dashboard Mandala Enterprise. Silakan gunakan menu di bawah untuk memulai! 👇`

    await sendMenu(chatId, successMsg)
}

async function getProfile(supabase: any, telegramId: number) {
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('telegram_id', telegramId)
        .single()
    return { profile: profile || null }
}

async function updateSession(supabase: any, userId: string, sessionData: any) {
    console.log("Updating Session:", userId, JSON.stringify(sessionData))
    await supabase.from('profiles').update({ bot_session: sessionData }).eq('id', userId)
}

async function sendMessage(chatId: number | string, text: string) {
    const token = Deno.env.get('TELEGRAM_BOT_TOKEN')
    try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'Markdown',
                // Keep the keyboard persistent even on regular messages
                reply_markup: MAIN_KEYBOARD
            })
        })
    } catch (e) {
        console.error("Fetch Error (sendMessage):", e)
    }
}

async function promptLinking(chatId: number | string) {
    await sendMessage(chatId, "⚠️ You need to link your account first. Go to your Profile Settings on the web app.")
}

async function sendMenu(chatId: number | string, text: string) {
    const token = Deno.env.get('TELEGRAM_BOT_TOKEN')
    try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                reply_markup: MAIN_KEYBOARD
            })
        })
    } catch (e) {
        console.error("Fetch Error (sendMenu):", e)
    }
}
