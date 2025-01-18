const Memory = require('../models/Memory')

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

module.exports = {
    createMemory,
}