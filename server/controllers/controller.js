
const { User, Room, Message } = require('../models')
const cloudinary = require('cloudinary');
class Controller {
    static async Login(req, res, next) {
        const { username } = req.body
        try {
            const user = await User.findOrCreate({ where: { username: username } })
            res.status(201).json(user)
        } catch (error) {
            console.log(error);
        }
    }
    static async readRoom(req, res, next) {
        const { id, username } = req.loginInfo
        try {
            console.log(id, username);
            const room = await Room.findAll()
            res.status(200).json(room)
        } catch (error) {
            console.log(error);

        }
    }
    static async readChat(req, res, next) {
        const { roomId } = req.params
        try {
            const chat = await Message.findAll({
                include: [{
                    model: User,
                    attributes: ['username']
                }, {
                    model: Room,
                    attributes: ['name']
                }],
                where: { roomId },
                order: [['id', 'ASC']],
            })
            res.status(200).json(chat)
        } catch (error) {
            console.log(error);

        }
    }
    static async sentChat(req, res, next) {
        const { id, username } = req.loginInfo
        const { roomId } = req.params
        const { chat } = req.body
        try {
            const sentchat = await Message.create({ roomId, userId: id, chat })
            res.status(201).json(sentchat)
        } catch (error) {
            console.log(error);

        }
    }
    static async createRoom(req, res, next) {
        const { name } = req.body
        try {
            const room = await Room.create({ name })
            res.status(201).json(room)
        } catch (error) {
            console.log(error);
        }
    }
    static async RoomDetail(req, res, next) {
        const { roomId } = req.params
        try {
            const roomDetail = await Room.findByPk(roomId)
            res.status(200).json(roomDetail)
        } catch (error) {
            console.log(error);
        }
    }
    static async RoomDel(req, res, next) {
        const { roomId } = req.params
        try {
            const delRoom = await Room.destroy({ where: { id: roomId } })
            res.status(200).json(delRoom)
        } catch (error) {
            console.log(error);
        }
    }
    static async sentImage(req, res, next) {
        const { id, username } = req.loginInfo
        const { roomId } = req.params
        const { chat } = req.body
        try {

            // Configuration
            cloudinary.config({
                cloud_name: 'dmar1b49z',
                api_key: '591919827826349',
                api_secret: 'NiDXRFxpjlP7Ni0Kt67p_dSviCs' // Click 'View API Keys' above to copy your API secret
            });

            // Upload an image
            const uploadResult = await cloudinary.uploader
                .upload(
                    chat, {
                    public_id: 'chat',
                }
                )
                .catch((error) => {
                    console.log(error, "<<<<<<1<<<<<<");
                });

            console.log(uploadResult);

            // Optimize delivery by resizing and applying auto-format and auto-quality
            const optimizeUrl = cloudinary.url('chat', {
                fetch_format: 'auto',
                quality: 'auto'
            });

            console.log(optimizeUrl, "<<<<<2<<<<<<<");

            // Transform the image: auto-crop to square aspect_ratio
            const autoCropUrl = cloudinary.url('chat', {
                crop: 'auto',
                gravity: 'auto',
                width: 500,
                height: 500,
            });

            console.log(autoCropUrl, "<<<<<3<<<<<<<");
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = Controller