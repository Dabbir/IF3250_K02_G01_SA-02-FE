// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null

    return (...args: Parameters<T>): void => {
        const later = () => {
            timeout = null
            func(...args)
        }

        if (timeout !== null) {
            clearTimeout(timeout)
        }

        timeout = setTimeout(later, wait)
    }
}
