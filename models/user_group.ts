import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface user_groupAttributes {
  id: number;
  id_user: number;
  id_group: number;
  id_user_type: number;
}

export type user_groupPk = "id";
export type user_groupId = user_group[user_groupPk];
export type user_groupOptionalAttributes = "id" | "id_user_type";
export type user_groupCreationAttributes = Optional<user_groupAttributes, user_groupOptionalAttributes>;

export class user_group extends Model<user_groupAttributes, user_groupCreationAttributes> implements user_groupAttributes {
  id!: number;
  id_user!: number;
  id_group!: number;
  id_user_type!: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof user_group {
    return user_group.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    id_user: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    id_group: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    id_user_type: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'user_group',
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
        name: "id_user",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_user" },
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
