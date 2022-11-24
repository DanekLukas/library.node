import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { book, bookId } from './book';

export interface document_typeAttributes {
  id: number;
  name: string;
}

export type document_typePk = "id";
export type document_typeId = document_type[document_typePk];
export type document_typeOptionalAttributes = "id" | "name";
export type document_typeCreationAttributes = Optional<document_typeAttributes, document_typeOptionalAttributes>;

export class document_type extends Model<document_typeAttributes, document_typeCreationAttributes> implements document_typeAttributes {
  id!: number;
  name!: string;

  // document_type hasMany book via id_document_type
  books!: book[];
  getBooks!: Sequelize.HasManyGetAssociationsMixin<book>;
  setBooks!: Sequelize.HasManySetAssociationsMixin<book, bookId>;
  addBook!: Sequelize.HasManyAddAssociationMixin<book, bookId>;
  addBooks!: Sequelize.HasManyAddAssociationsMixin<book, bookId>;
  createBook!: Sequelize.HasManyCreateAssociationMixin<book>;
  removeBook!: Sequelize.HasManyRemoveAssociationMixin<book, bookId>;
  removeBooks!: Sequelize.HasManyRemoveAssociationsMixin<book, bookId>;
  hasBook!: Sequelize.HasManyHasAssociationMixin<book, bookId>;
  hasBooks!: Sequelize.HasManyHasAssociationsMixin<book, bookId>;
  countBooks!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof document_type {
    return document_type.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'document_type',
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
    ]
  });
  }
}
