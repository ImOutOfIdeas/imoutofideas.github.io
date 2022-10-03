export interface Task {
    // ? makes field optional
    id?: number,
    text: string,
    day: string,
    reminder: boolean
}