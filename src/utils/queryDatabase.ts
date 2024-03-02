import aqp from 'api-query-params'
import { PopulateOptions } from 'mongoose'
import { PrismaServie } from 'src/services/prisma.service'

const prismaService: PrismaServie = new PrismaServie()
export const queryDatabaseWithFilter = async (queryString: string, modelQuery: any): Promise<object> => {
    const { filter, sort, projection, population, limit } = aqp(queryString as string)
    const limit_page = limit ? Number(limit) : 10
    const skip = filter.page ? (Number(filter.page) - 1) * limit : 0

    delete filter.page
    if (!filter.isExactly) {
        Object.keys(filter).forEach((key) => {
            filter[key] = { contains: filter[key], mode: 'insensitive' }
        })
    }
    const queryFilter = {
        OR: [JSON.parse(JSON.stringify(filter))]
    }
    delete filter.isExactly
    if (projection) {
        delete projection.password
        Object.keys(projection).forEach((key) => {
            projection[key] = true as any
        })
    }
    let keySort = 'desc'
    if (sort) {
        if (Object.keys(sort).toString() === 'desc' || Object.keys(sort).toString() === 'asc') {
            keySort = Object.keys(sort).toString()
        }
    }
    const populate = population
        ? population.reduce((acc: object, curr: PopulateOptions) => {
            acc[curr.path.trim()] = true
            return acc
        }, {})
        : {}
    const result = await modelQuery.findMany({
        take: limit_page,
        skip,
        where: queryFilter,
        include: populate,
        orderBy: {
            createdAt: keySort
        }
    })
    for (const key in result) {
        if (result[key].hasOwnProperty('password')) {
            delete result[key].password
        }
    }
    return result
}
