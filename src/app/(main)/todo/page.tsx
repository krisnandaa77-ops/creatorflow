import { getUnifiedDailyTodos } from '@/actions/todo-actions'
import DailyFocusContent from '@/components/features/todo/DailyFocusContent'

export default async function TodoPage() {
    const todos = await getUnifiedDailyTodos()

    return <DailyFocusContent initialTodos={todos} />
}
