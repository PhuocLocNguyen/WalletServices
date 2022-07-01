export const getItemStorage = (key) => {
    return JSON.parse(window.localStorage.getItem(key))
}

export const setItemStorage = (item, key) => {
    window.localStorage.setItem(key, JSON.stringify(item))
}

export const removeItemStorage = (key) => {
    window.localStorage.removeItem(key)
}