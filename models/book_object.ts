import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { book, bookId } from './book';
import type { book_share, book_shareId } from './book_share';

export interface book_objectAttributes {
  id: number;
  created_at: Date;
  id_book: number;
  signature: string;
  metadata: string;
}

export type book_objectPk = "id";
export type book_objectId = book_object[book_objectPk];
export type book_objectOptionalAttributes = "id" | "created_at" | "id_book" | "signature" | "metadata";
export type book_objectCreationAttributes = Optional<book_objectAttributes, book_objectOptionalAttributes>;

export class book_object extends Model<book_objectAttributes, book_objectCreationAttributes> implements book_objectAttributes {
  id!: number;
  created_at!: Date;
  id_book!: number;
  signature!: string;
  metadata!: string;

  // book_object belongsTo book via id_book
  id_book_book!: book;
  getId_book_book!: Sequelize.BelongsToGetAssociationMixin<book>;
  setId_book_book!: Sequelize.BelongsToSetAssociationMixin<book, bookId>;
  createId_book_book!: Sequelize.BelongsToCreateAssociationMixin<book>;
  // book_object hasMany book_share via id_book_object
  book_shares!: book_share[];
  getBook_shares!: Sequelize.HasManyGetAssociationsMixin<book_share>;
  setBook_shares!: Sequelize.HasManySetAssociationsMixin<book_share, book_shareId>;
  addBook_share!: Sequelize.HasManyAddAssociationMixin<book_share, book_shareId>;
  addBook_shares!: Sequelize.HasManyAddAssociationsMixin<book_share, book_shareId>;
  createBook_share!: Sequelize.HasManyCreateAssociationMixin<book_share>;
  removeBook_share!: Sequelize.HasManyRemoveAssociationMixin<book_share, book_shareId>;
  removeBook_shares!: Sequelize.HasManyRemoveAssociationsMixin<book_share, book_shareId>;
  hasBook_share!: Sequelize.HasManyHasAssociationMixin<book_share, book_shareId>;
  hasBook_shares!: Sequelize.HasManyHasAssociationsMixin<book_share, book_shareId>;
  countBook_shares!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof book_object {
    return book_object.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    id_book: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      references: {
        model: 'book',
        key: 'id'
      }
    },
    signature: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    metadata: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'book_object',
    timestamps: false,
    freezeTableName: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "id_book",
        using: "BTREE",
        fields: [
          { name: "id_book" },
        ]
      },
    ]
  });
  }
}
