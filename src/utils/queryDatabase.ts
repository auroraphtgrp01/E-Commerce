import aqp from 'api-query-params'
import { PopulateOptions } from 'mongoose'

export const queryDatabaseWithFilter = async (
  queryString: string,
  modelQuery: any,
  customePopulate?: any
): Promise<object> => {
  const { filter, sort, projection, population, limit } = aqp(queryString as string)
  const isIncludePopulate = filter.includePopulate
  const limit_page = limit ? Number(limit) : 10
  const skip = filter.page ? (Number(filter.page) - 1) * limit : 0
  const page = filter?.page
  delete filter.page
  if (!filter.isExactly) {
    Object.keys(filter).forEach((key) => {
      filter[key] = { contains: filter[key], mode: 'insensitive' }
    })
  } else {
    delete filter?.isExactly
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
  let populate: any = {}
  if (customePopulate && isIncludePopulate) {
    populate = customePopulate
  } else {
    populate = population
      ? population.reduce((acc: object, curr: PopulateOptions) => {
          acc[curr.path.trim()] = true
          return acc
        }, {})
      : {}
  }

  delete filter.includePopulate
  const queryFilter =
    Object.keys(filter).length !== 0
      ? {
          OR: [JSON.parse(JSON.stringify(filter))]
        }
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
  const count = await modelQuery.count({
    where: queryFilter
  })
  for (const key in result) {
    if (result[key].hasOwnProperty('password')) {
      delete result[key].password
    }
  }
  return {
    page: page ? Number(page) : 1,
    totalPage: Math.ceil(count / limit_page),
    data: result
  }
}
