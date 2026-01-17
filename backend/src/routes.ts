import { Router } from 'express'
import predpisi from './predpisi/predpisi.route'

const rootRouter = Router()
rootRouter.use('/predpisi', predpisi)

export default rootRouter
