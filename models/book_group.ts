import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface book_groupAttributes {
  id: number;
  id_book: number;
  id_group: number;
}

export type book_groupPk = "id";
export type book_groupId = book_group[book_groupPk];
export type book_groupOptionalAttributes = "id";
export type book_groupCreationAttributes = Optional<book_groupAttributes, book_groupOptionalAttributes>;

export class book_group extends Model<book_groupAttributes, book_groupCreationAttributes> implements book_groupAttributes {
  id!: number;
  id_book!: number;
  id_group!: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof book_group {
    return book_group.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    id_book: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    id_group: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'book_group',
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
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_book" },
          { name: "id_group" },
        ]
      },
      {
        name: "id_group",
        using: "BTREE",
        fields: [
          { name: "id_group" },
        ]
      },
    ]
  });
  }
}
