import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { book_share, book_shareId } from './book_share';

export interface userAttributes {
  id: number;
  created_at: Date;
  id_group_actual: number;
  password: string;
  first_name: string;
  surname: string;
  address: string;
  code: string;
  city: string;
  state: string;
  email: string;
}

export type userPk = "id";
export type userId = user[userPk];
export type userOptionalAttributes = "id" | "created_at" | "password" | "first_name" | "surname" | "address" | "code" | "city" | "state" | "email";
export type userCreationAttributes = Optional<userAttributes, userOptionalAttributes>;

export class user extends Model<userAttributes, userCreationAttributes> implements userAttributes {
  id!: number;
  created_at!: Date;
  id_group_actual!: number;
  password!: string;
  first_name!: string;
  surname!: string;
  address!: string;
  code!: string;
  city!: string;
  state!: string;
  email!: string;

  // user hasMany book_share via id_user
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

  static initModel(sequelize: Sequelize.Sequelize): typeof user {
    return user.init({
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
    id_group_actual: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    surname: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    code: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      unique: "email"
    }
  }, {
    sequelize,
    tableName: 'user',
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
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
  }
}
