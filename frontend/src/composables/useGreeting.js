import { computed } from 'vue'

export function useGreeting() {
  return computed(() => {
    const hour = new Date().getHours()
    if (hour >= 4 && hour < 12) return 'Good Morning'
    if (hour >= 12 && hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  })
}
