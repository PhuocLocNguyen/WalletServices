export const getItemStorage = (key) => {
    return JSON.parse(window.localStorage.getItem(key))
}

export const getItemStoragePersist = (key) => {
    const persist = localStorage.getItem('persist:C98HubV2');
    const store = JSON.parse(persist);
    return store[key]
}


export const setItemStorage = (item, key) => {
    window.localStorage.setItem(key, JSON.stringify(item))
}

export const removeItemStorage = (key) => {
    window.localStorage.removeItem(key)
}

export const getLength = (value) => (value ? value.length : 0)


export const lowerCase = (value) => {
    return value && value.toLowerCase ? value.toLowerCase() : value
  }

export const upperCase = (value) => {
    return value && value.toUpperCase ? value.toUpperCase() : value
}