import { book as _book } from './book'
import { book_group as _book_group } from './book_group'
import { book_object as _book_object } from './book_object'
import { book_share as _book_share } from './book_share'
import { document_type as _document_type } from './document_type'
import { group as _group } from './group'
import { user as _user } from './user'
import { user_group as _user_group } from './user_group'
import { user_type as _user_type } from './user_type'
import { view_book as _view_book } from './view_book'
import type { Sequelize } from 'sequelize'
import type { bookAttributes, bookCreationAttributes } from './book'
import type { book_groupAttributes, book_groupCreationAttributes } from './book_group'
import type { book_objectAttributes, book_objectCreationAttributes } from './book_object'
import type { book_shareAttributes, book_shareCreationAttributes } from './book_share'
import type { document_typeAttributes, document_typeCreationAttributes } from './document_type'
import type { groupAttributes, groupCreationAttributes } from './group'
import type { userAttributes, userCreationAttributes } from './user'
import type { user_groupAttributes, user_groupCreationAttributes } from './user_group'
import type { user_typeAttributes, user_typeCreationAttributes } from './user_type'
import type {
  bookAttributes as view_bookAttributes,
  bookCreationAttributes as view_bookCreationAttributes,
} from './view_book'

import { view_member as _view_member } from './view_member'
import type { memberAttributes, memberCreationAttributes } from './view_member'

import { view_group as _view_group } from './view_group'
import type {
  groupAttributes as view_groupAttributes,
  groupCreationAttributes as view_groupCreationAttributes,
} from './view_group'

export {
  _book as book,
  _book_group as book_group,
  _book_object as book_object,
  _book_share as book_share,
  _document_type as document_type,
  _group as group,
  _user as user,
  _user_group as user_group,
  _user_type as user_type,
  _view_book as view_book,
  _view_member as view_member,
  _view_group as view_group,
}

export type {
  bookAttributes,
  bookCreationAttributes,
  book_groupAttributes,
  book_groupCreationAttributes,
  book_objectAttributes,
  book_objectCreationAttributes,
  book_shareAttributes,
  book_shareCreationAttributes,
  document_typeAttributes,
  document_typeCreationAttributes,
  groupAttributes,
  groupCreationAttributes,
  userAttributes,
  userCreationAttributes,
  user_groupAttributes,
  user_groupCreationAttributes,
  user_typeAttributes,
  user_typeCreationAttributes,
  view_bookAttributes,
  view_bookCreationAttributes,
  memberAttributes,
  memberCreationAttributes,
  view_groupAttributes,
  view_groupCreationAttributes,
}

export function initModels(sequelize: Sequelize) {
  const book = _book.initModel(sequelize)
  const book_group = _book_group.initModel(sequelize)
  const book_object = _book_object.initModel(sequelize)
  const book_share = _book_share.initModel(sequelize)
  const document_type = _document_type.initModel(sequelize)
  const group = _group.initModel(sequelize)
  const user = _user.initModel(sequelize)
  const user_group = _user_group.initModel(sequelize)
  const user_type = _user_type.initModel(sequelize)
  const view_book = _view_book.initModel(sequelize)
  const view_member = _view_member.initModel(sequelize)
  const view_group = _view_group.initModel(sequelize)

  book_object.belongsTo(book, { as: 'id_book_book', foreignKey: 'id_book' })
  book.hasMany(book_object, { as: 'book_objects', foreignKey: 'id_book' })
  book_share.belongsTo(book_object, {
    as: 'id_book_object_book_object',
    foreignKey: 'id_book_object',
  })
  book_object.hasMany(book_share, { as: 'book_shares', foreignKey: 'id_book_object' })
  book.belongsTo(document_type, {
    as: 'id_document_type_document_type',
    foreignKey: 'id_document_type',
  })
  document_type.hasMany(book, { as: 'books', foreignKey: 'id_document_type' })
  book_share.belongsTo(user, { as: 'id_user_user', foreignKey: 'id_user' })
  user.hasMany(book_share, { as: 'book_shares', foreignKey: 'id_user' })

  return {
    book: book,
    book_group: book_group,
    book_object: book_object,
    book_share: book_share,
    document_type: document_type,
    group: group,
    user: user,
    user_group: user_group,
    user_type: user_type,
    view_book: view_book,
    view_member: view_member,
    view_group: view_group,
  }
}
