const Memory = require('../models/Memory')

const fs = require('fs')

const removeOldImage = (memory) => {
    fs.unlink(`public/${memory.src}`, (err) => {
        if(err) {
            console.log(err)
        } else {
            console.log('Old image removed')
        }
    })
}

const createMemory = async(req, res) => {
    try {
 
        const { title, description } = req.body

        const src = `images/${req.file.filename}`

        if(!title || !description) {
            return res.status(400).json({ msg: 'Title and description are required' })
        }

        const newMemory = new Memory({
            title, src, description
        })

        await newMemory.save()

        res.json({ msg: 'Memory created', newMemory})

    } catch (error) {
        console.log(error.message)
        res.status(500).send('Ocorreu um erro')
    }
}

const getMemories = async(req, res) => {
    try {
        const memories = await Memory.find()

        res.json(memories)
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Ocorreu um erro')
    }
}

const getMemory = async(req, res) => {
    try {
        const memory = await Memory.findById(req.params.id)

        if(!memory) {
            return res.status(404).json({ msg: 'Memory not found' })
        }

        res.json(memory)
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Ocorreu um erro')
    }
}

const deleteMemory = async(req, res) => {
    try {
        const memory = await Memory.findByIdAndRemove(req.params.id)

        if(!memory) {
            return res.status(404).json({ msg: 'Memory not found' })
        }

        removeOldImage(memory)

        res.json({ msg: 'Memory removed' })
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Ocorreu um erro')
    }
}

const updateMemory = async(req, res) => {
    try {
        const { title, description } = req.body

        let src = null

        if(req.file){
            src = `images/${req.file.filename}`
        }

        const memory = await Memory.findById(req.params.id)

        if(!memory) {
            return res.status(404).json({ msg: 'Memory not found' })
        }

        if(src) {
            removeOldImage(memory)
        }

        const updateDate = {}

        if(title) updateDate.title = title
        if(description) updateDate.description = description
        if(src) updateDate.src = src

        const updateMemory = await Memory.findByIdAndUpdate(req.params.id, updateDate, { new: true })

        res.json({updateMemory, msg: 'Memory updated'})
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Ocorreu um erro')
    }
}

const toggleFavorite = async(req, res) => {
    try {
        const memory = await Memory.findById(req.params.id)

        if(!memory) {
            return res.status(404).json({ msg: 'Memory not found' })
        }

        memory.favorite = !memory.favorite

        await memory.save()

        res.json({ msg: 'Add aos favoritos', memory })
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Ocorreu um erro')
    }
}

const addComment = async(req, res) => {
    try {

        const {name, text} = req.body

        if(!name || !text) {
            return res.status(400).json({ msg: 'Name and text are required' })
        }

        const comment = { name, text }

        const memory = await Memory.findById(req.params.id)

        if(!memory) {
            return res.status(404).json({ msg: 'Memory not found' })
        }

        memory.comments.push(comment)

        await memory.save()

        res.json({ msg: 'Coment add', memory })
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Ocorreu um erro')
    }
}


module.exports = {
    createMemory,
    getMemories,
    getMemory,
    deleteMemory,
    updateMemory,
    toggleFavorite,
    addComment,
}