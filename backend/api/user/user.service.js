import { readJsonFile } from '../../services/util.service.js'
import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'
import { ObjectId } from 'mongodb'


// const users = readJsonFile('data/user.json')

export const userService = {
    add, // Create (Signup)
	getById, // Read (Profile page)
	update, // Update (Edit profile)
	remove, // Delete (remove user)
	query, // List (of users)
	getByUsername, // Used for Login
}

_loadUsers()

async function query() {
    try {
        const collection = await dbService.getCollection('user')
        let users = await collection.find({}).toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = user._id.getTimestamp()
            // Returning fake fresh data
            // user.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
            return user
        })
        return users
    } catch (err) {
        loggerService.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        let criteria = { _id: ObjectId.createFromHexString(userId) }

        const collection = await dbService.getCollection('user')
        const user = await collection.findOne(criteria)
        user.createdAt = user._id.getTimestamp()
        delete user.password

        criteria = { byUserId: userId }

        return user
    } catch (err) {
        loggerService.error(`while finding user by id: ${userId}`, err)
        throw err
    }
}

async function getByUsername(username) {
	try {
		const collection = await dbService.getCollection('user')
		const user = await collection.findOne({ username })
        if (user && typeof user === 'object') delete user.password
		return user
	} catch (err) {
		loggerService.error(`while finding user by username: ${username}`, err)
		throw err
	}
}

async function remove(userId) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(userId) }

        const collection = await dbService.getCollection('user')
        await collection.deleteOne(criteria)
    } catch (err) {
        loggerService.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        // pick only updatable properties
        const userToSave = {
            _id: ObjectId.createFromHexString(user._id), // needed for the returnd obj
            fullname: user.fullname,
            imgUrl: user.imgUrl,
            isAdmin: user.isAdmin,
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        return userToSave
    } catch (err) {
        loggerService.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
	try {
		// pick only updatable fields!
		const userToAdd = {
			username: user.username,
			password: user.password,
			fullname: user.fullname,
			imgUrl: user.imgUrl,
			isAdmin: user.isAdmin,
		}
		const collection = await dbService.getCollection('user')
		await collection.insertOne(userToAdd)
		return userToAdd
	} catch (err) {
		loggerService.error('cannot add user', err)
		throw err
	}
}

async function _loadUsers() {
    try {
        const users = readJsonFile('./data/user.json')
        
        const userCollection = await dbService.getCollection('user')
        const isEmpty = await userCollection.countDocuments() === 0

        if (isEmpty) {
            const userWithId = users.map(user => ({ ...user, _id: new ObjectId()}))
            await userCollection.insertMany(userWithId)
        }
    } catch (error) {
        console.error("Error in _loadUsers:", error)
        throw error
    }
}

