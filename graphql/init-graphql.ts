import * as Common from './Common'
import { GraphQLSchemaModule } from 'apollo-server-core'
import { Sequelize } from 'sequelize'
import { bookGraphql } from './book'
import { groupGraphql } from './group'
import { initModels } from '../models/init-models'
import { userGraphql } from './user'
import { view_bookGraphql } from './view_book'
import { view_groupGraphql } from './view_group'
import { view_memberGraphql } from './view_member'

export const initGraphqls = (
  host: string,
  port: number,
  db: string,
  user: string,
  password: string
) => {
  const sequelize = new Sequelize(db, user, password, {
    host,
    port,
    dialect: 'mysql',
    define: { engine: 'MYISAM' },
  })

  const initedModels = initModels(sequelize)
  // const mutations = {...bookGraphql(initedModels.book).resolvers.Mutation, ...userGraphql(initedModels.user).resolvers.Mutation, ...groupGraphql(initedModels.group).resolvers.Mutation}
  // const queries = {...bookGraphql(initedModels.book).resolvers.Query, ...userGraphql(initedModels.user).resolvers.Query, ...groupGraphql(initedModels.group).resolvers.Query}
  // const typeDefs = {...bookGraphql(initedModels.book).typeDefs, ...userGraphql(initedModels.user).typeDefs, ...groupGraphql(initedModels.group).typeDefs}

  // let mutations = {}
  // let queries = {}
  // let definitions = {}
  // let kind = {}
  // let loc = {}

  // ;[bookGraphql(initedModels.book),
  //   userGraphql(initedModels.user),
  //   groupGraphql(initedModels.group)].
  // forEach(
  // (itm:any) => {
  // mutations = {...mutations, ...itm.resolvers.Mutation}
  // queries = {...queries, ...itm.resolvers.Query}
  // definitions = {...definitions, ...itm.typeDefs.definitions}
  // kind = {...kind, ...itm.typeDefs.kind}
  // loc = {...loc, ...itm.typeDefs.loc}
  // })

  // const all = {resolvers:{Query:queries, Mutation: mutations}, typeDefs: {definitions: definitions, kind:'Document', loc:loc}}
  // const all = {resolvers:{Query:queries, Mutation: mutations}, typeDefs: Common.typeDefs}

  // console.info({definitions: definitions, kind:kind, loc:loc})

  const modules: GraphQLSchemaModule[] = [
    Common,
    bookGraphql(initedModels.book),
    userGraphql(initedModels.user),
    groupGraphql(initedModels.group),
    view_bookGraphql(initedModels.view_book),
    view_memberGraphql(initedModels.view_member),
    view_groupGraphql(initedModels.view_group),
  ]

  return modules
}
