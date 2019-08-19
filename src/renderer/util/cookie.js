const session = require('electron').remote.session

const YANDE_URL = 'https://yande.re'

export default {
    // 设置cookie
    setCookie (name, value) {
        let Days = 30
        let exp = new Date()
        let date = Math.round(exp.getTime() / 1000) + Days * 24 * 60 * 60
        const cookie = {
            url: YANDE_URL,
            name: name,
            value: value,
            expirationDate: date
        }
        return new Promise((resolve, reject) => {
            session.defaultSession.cookies.set(cookie, (error) => {
                if (error) {
                    console.error(error)
                    reject(error)
                } else {
                    resolve()
                }
            })
        })
    },
    // 获取cookie
    getCookie (name) {
        let data = []
        return new Promise((resolve, reject) => {
            session.defaultSession.cookies.get({ name:name}, (error, cookies) => {
                // console.log('cookies', cookies)
                if (cookies.length > 0) {
                    data = cookies
                }
                if (error) {
                    reject(error)
                } else {
                    resolve(cookies)
                }
            })
        })
    },
    // 清除cookie
    clearCookies (url = YANDE_URL) {
        session.defaultSession.clearStorageData({
            origin: url,
            storages: ['cookies']
        }, (error) => {
            if (error) console.error(error)
        })
    }
}