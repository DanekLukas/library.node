import { GraphQLSchemaModule } from 'apollo-server-core'
import { bookAttributes, book as bookInit } from '../models/book'
import { book_group as book_groupInit } from '../models/book_group'
import { findAll, findById, findSome, totalCount } from './utils'
import { gql } from 'apollo-server-express'
type book = ReturnType<typeof bookInit.initModel>

export const bookGraphql = (dbTable: book): GraphQLSchemaModule => {
  return {
    typeDefs: gql`
      input bookInput {
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
      }
      extend type Query {
        books(offset: Int, limit: Int): [book]
        findSomeBooks(
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
        ): [book]
        book(id: ID!): book
        totalCountBooks(
          whereName: String
          whereAuthors: String
          whereLanguage: String
          wherePublished: String
          whereTheme: String
          whereMetadata: String
          whereIsbn: String
        ): Int
      }
      extend type Mutation {
        insertBook(
          name: String
          authors: String
          language: String
          published: String
          theme: String
          metadata: String
          isbn: String
        ): Int!
        updateBook(
          id: Int
          name: String
          authors: String
          language: String
          published: String
          theme: String
          metadata: String
          isbn: String
        ): Int!
        deleteBook(where: whereId): Boolean!
      }
      type book {
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
      }
    `,
    resolvers: {
      Query: {
        _books: async (obj: any, args: any, context: any, info: any) =>
          await findAll(dbTable, args.limit || 10, args.offset || 0),
        _findSomeBooks: async (obj: any, args: any, context: any, info: any) =>
          await findSome(dbTable, args.order || 'id', args.offset || 0, args.limit || 10),
        _book: async (obj: any, args: any, context: any, info: any) =>
          (await findById(dbTable, args.id)) as bookAttributes,
        _totalCountbook: async (obj: any, args: any, context: any, info: any) =>
          await totalCount(dbTable),
      },
      Mutation: {
        insertBook: async (obj: any, args: any, context: any, info: any) => {
          console.info(context)
          const id = (
            await dbTable.create(
              Object.assign(args, { id_document_type: 1, id_created_by: context.session.user.id })
            )
          ).id
          const group = await book_groupInit.create({
            id_book: id,
            id_group: context.session.user.actual,
          })
          return id
        },
        updateBook: async (obj: any, args: any, context: any, info: any) =>
          (
            await dbTable.update(args, {
              where: { id: args.id, id_created_by: context.session.user.id },
            })
          )[0],
        // .then(async (ret: Promise<[number]>) => {
        //   return (await ret)[0]
        // }),
        deleteBook: async (obj: any, args: any, context: any, info: any) =>
          await dbTable
            .destroy({
              where: { ...args.where, ...{ id_created_by: context.session.user.id } },
            })
            .then(() => {
              return true
            }),
      },
    },
  }
}
