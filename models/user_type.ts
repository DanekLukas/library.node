import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface user_typeAttributes {
  id: number;
  name: string;
}

export type user_typePk = "id";
export type user_typeId = user_type[user_typePk];
export type user_typeOptionalAttributes = "id" | "name";
export type user_typeCreationAttributes = Optional<user_typeAttributes, user_typeOptionalAttributes>;

export class user_type extends Model<user_typeAttributes, user_typeCreationAttributes> implements user_typeAttributes {
  id!: number;
  name!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof user_type {
    return user_type.init({
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
    tableName: 'user_type',
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
