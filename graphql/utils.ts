import { Sequelize } from 'sequelize/types'
import { bookAttributes } from '../models/book'
export interface ICommon {
  findByPk: (id: number) => Promise<any>
  findAll: ({}) => Promise<any>
  findOne: ({}) => Promise<any>
  create: ({}: any) => Promise<any>
  count: ({}) => Promise<any>
}

export const findById = async <T extends ICommon, R>(
  table: T,
  id: number
  // ret: R
): Promise<R> => {
  const data = await table.findByPk(id)
  const ret = {} as R
  Object.keys(data).forEach(key => {
    ret[key as keyof typeof ret] = data.getDataValue(key)
  })
  return ret as R
}

export const findAll = async <T extends ICommon>(
  table: T,
  limit = 10,
  offset = 0,
  where = {},
  attributes?: Array<string>
) => {
  const data = await table.findAll({
    attributes,
    offset,
    limit,
    where,
  })
  const ret: Array<typeof data> = []
  data.forEach((line: typeof data, index: number) => {
    ret[index] = {}
    Object.keys(line).forEach(key => {
      ret[index][key] = line.getDataValue(key)
    })
  })
  return ret
}

export const insert = async <T extends ICommon>(table: T, values: any, sequelize: Sequelize) => {
  await sequelize.sync()
  return await table.create(values)
}

export const update = async <T extends ICommon>(
  table: T,
  values: any
): Promise<[number, bookAttributes[]]> => {
  const data = await table.findByPk(values.id)
  if (!data) return [0, []]
  await data.set(values)
  await data.save()
  return [1, [data]]
}

export const totalCount = async <T extends ICommon>(table: T, where = {}) => {
  return await table.count(where || {})
}

export const findSome = async <T extends ICommon>(
  table: T,
  order = 'id',
  offset = 0,
  limit = 10,
  where = {}
) => {
  const data = await table.findAll({
    attributes: {},
    order: [[order, 'ASC']],
    offset,
    limit,
    where,
  })
  const ret: Array<typeof data> = []
  data.forEach((line: typeof data, index: number) => {
    ret[index] = {}
    Object.keys(line).forEach(key => {
      ret[index][key] = line.getDataValue(key)
    })
  })
  return ret
}

export const findOne = async <T extends ICommon, R>(table: T, where = {}) => {
  const data = await table.findOne({ where: where })
  const ret = {} as R
  Object.keys(data).forEach(key => {
    ret[key as keyof typeof ret] = data.getDataValue(key)
  })
  return ret as R
}
