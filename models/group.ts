import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface groupAttributes {
  id: number;
  created_at: Date;
  created_by: number;
  name: string;
}

export type groupPk = "id";
export type groupId = group[groupPk];
export type groupOptionalAttributes = "id" | "created_at" | "name";
export type groupCreationAttributes = Optional<groupAttributes, groupOptionalAttributes>;

export class group extends Model<groupAttributes, groupCreationAttributes> implements groupAttributes {
  id!: number;
  created_at!: Date;
  created_by!: number;
  name!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof group {
    return group.init({
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
    created_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'group',
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
