import Cryptr from 'cryptr'

import { userService } from '../user/user.service.js'
import { loggerService } from '../../services/logger.service.js'
import { getHashPassword } from '../../services/util.service.js'

const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

export const authService = {
    getLoginToken,
    validateToken,
    login,
    signup,
}


function getLoginToken(user) {
    const str = JSON.stringify(user)
    const encryptedStr = cryptr.encrypt(str)
    return encryptedStr
}

function validateToken(token) {
    try {
        const json = cryptr.decrypt(token)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

async function login(username, password) {
    const user = await userService.getByUsername(username)
	if (!user) return Promise.reject('Invalid username or password')

	// TODO: un-comment for real login
	// const match = await bcrypt.compare(password, user.password)
	// if (!match) return Promise.reject('Invalid username or password')

    // Removing passwords and personal data
    const miniUser = {
        _id: user._id,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        isAdmin: user.isAdmin,
        // Additional fields required for miniuser
    }
    return miniUser

}

async function signup({ username, password, fullname }) {
    // const saltRounds = 10

    loggerService.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
    if (!username || !password || !fullname) throw 'Missing required signup information'
    
    const userExist = await userService.getByUsername(username)
    if (userExist) throw 'Username already taken'
    
    const hash = await getHashPassword(password)
    return userService.add({ username, password: hash, fullname })
}
