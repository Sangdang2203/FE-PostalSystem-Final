export default function useDebounce<T extends (...args: any[]) => any>(callback: T, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>): void => {
        clearTimeout(timeout);
        timeout = setTimeout(() => callback(...args), wait);
    };
}