import { GraphQLSchemaModule } from 'apollo-server-core'
import { bookAttributes, view_book as view_bookInit } from '../models/view_book'
import { findAll, findOne, findSome, totalCount } from './utils'
import { gql } from 'apollo-server-express'

import { Op } from 'sequelize'

type VIEW_book = ReturnType<typeof view_bookInit.initModel>

export const view_bookGraphql = (dbTable: VIEW_book): GraphQLSchemaModule => {
  return {
    typeDefs: gql`
      input view_bookInput {
        id: Int
        created_at: Date
        id_document_type: Int
        name: String
        authors: String
        language: String
        published: String
        theme: String
        metadata: String
        isbn: String
        document_type_name: String
        id_group: Int
        group_name: String
        id_user: Int
        email: String
      }
      extend type Query {
        view_books(id_group: Int, offset: Int, limit: Int): [v_book]
        findSomeV_book(
          id_group: Int
          offset: Int
          limit: Int
          order: String
          whereName: String
          whereAuthors: String
          whereLanguage: String
          wherePublished: String
          whereTheme: String
          whereMetadata: String
          whereIsbn: String
        ): [v_book]
        view_book(id: ID!): v_book
        v_totalCountBook(
          id_group: Int
          whereName: String
          whereAuthors: String
          whereLanguage: String
          wherePublished: String
          whereTheme: String
          whereMetadata: String
          whereIsbn: String
        ): Int
      }
      type v_book {
        id: Int
        created_at: Date
        id_document_type: Int
        name: String
        authors: String
        language: String
        published: String
        theme: String
        metadata: String
        isbn: String
        document_type_name: String
        id_group: Int
        group_name: String
        id_user: Int
        email: String
      }
    `,
    resolvers: {
      Query: {
        books: async (obj: any, args: any, context: any, info: any) =>
          await findAll(dbTable, args.limit || 10, args.offset || 0, {
            id_user: context.session.user.id,
          }),
        findSomeBooks: async (obj: any, args: any, context: any, info: any) => {
          const whereName = args.whereName
            ? { name: { [Op.like]: `%${args.whereName}%` } }
            : undefined
          const whereAuthors = args.whereAuthors
            ? { authors: { [Op.like]: `%${args.whereAuthors}%` } }
            : undefined
          const whereLanguage = args.whereLanguage
            ? { name: { [Op.like]: `%${args.whereLanguage}%` } }
            : undefined
          const wherePublished = args.wherePublished
            ? { name: { [Op.like]: `%${args.wherePublished}%` } }
            : undefined
          const whereTheme = args.whereTheme
            ? { name: { [Op.like]: `%${args.whereTheme}%` } }
            : undefined
          const whereMetadata = args.whereMetadata
            ? { name: { [Op.like]: `%${args.whereMetadata}%` } }
            : undefined
          const whereIsbn = args.whereIsbn
            ? { name: { [Op.like]: `%${args.whereIsbn}%` } }
            : undefined

          return await findSome(dbTable, args.order || 'id', args.offset || 0, args.limit || 10, {
            ...{ id_user: context.session.user.id },
            ...{ id_group: context.session.user.actual },
            ...(whereName || {}),
            ...(whereAuthors || {}),
            ...(whereLanguage || {}),
            ...(wherePublished || {}),
            ...(whereTheme || {}),
            ...(whereMetadata || {}),
            ...(whereIsbn || {}),
          })
        },
        book: async (obj: any, args: any, context: any, info: any) =>
          await findOne(dbTable, { id: args.id, id_user: context.session.user.id }),
        totalCountBooks: async (obj: any, args: any, context: any, info: any) => {
          const whereName = args.whereName
            ? { name: { [Op.like]: `%${args.whereName}%` } }
            : undefined
          const whereAuthors = args.whereAuthors
            ? { authors: { [Op.like]: `%${args.whereAuthors}%` } }
            : undefined
          const whereLanguage = args.whereLanguage
            ? { name: { [Op.like]: `%${args.whereLanguage}%` } }
            : undefined
          const wherePublished = args.wherePublished
            ? { name: { [Op.like]: `%${args.wherePublished}%` } }
            : undefined
          const whereTheme = args.whereTheme
            ? { name: { [Op.like]: `%${args.whereTheme}%` } }
            : undefined
          const whereMetadata = args.whereMetadata
            ? { name: { [Op.like]: `%${args.whereMetadata}%` } }
            : undefined
          const whereIsbn = args.whereIsbn
            ? { name: { [Op.like]: `%${args.whereIsbn}%` } }
            : undefined

          return await totalCount(dbTable, {
            where: {
              ...{ id_user: context.session.user.id },
              ...(whereName || {}),
              ...(whereAuthors || {}),
              ...(whereLanguage || {}),
              ...(wherePublished || {}),
              ...(whereTheme || {}),
              ...(whereMetadata || {}),
              ...(whereIsbn || {}),
            },
          })
        },
      },
    },
  }
}
