import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { book_object, book_objectId } from './book_object';
import type { user, userId } from './user';

export interface book_shareAttributes {
  id: number;
  created_at: Date;
  id_user: number;
  id_book_object: number;
  lent_on: string;
  lent_for: string;
  reservation: number;
  local_only: number;
}

export type book_sharePk = "id";
export type book_shareId = book_share[book_sharePk];
export type book_shareOptionalAttributes = "id" | "created_at" | "id_user" | "id_book_object" | "lent_on" | "lent_for" | "reservation" | "local_only";
export type book_shareCreationAttributes = Optional<book_shareAttributes, book_shareOptionalAttributes>;

export class book_share extends Model<book_shareAttributes, book_shareCreationAttributes> implements book_shareAttributes {
  id!: number;
  created_at!: Date;
  id_user!: number;
  id_book_object!: number;
  lent_on!: string;
  lent_for!: string;
  reservation!: number;
  local_only!: number;

  // book_share belongsTo book_object via id_book_object
  id_book_object_book_object!: book_object;
  getId_book_object_book_object!: Sequelize.BelongsToGetAssociationMixin<book_object>;
  setId_book_object_book_object!: Sequelize.BelongsToSetAssociationMixin<book_object, book_objectId>;
  createId_book_object_book_object!: Sequelize.BelongsToCreateAssociationMixin<book_object>;
  // book_share belongsTo user via id_user
  id_user_user!: user;
  getId_user_user!: Sequelize.BelongsToGetAssociationMixin<user>;
  setId_user_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createId_user_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof book_share {
    return book_share.init({
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
    id_user: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    id_book_object: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      references: {
        model: 'book_object',
        key: 'id'
      }
    },
    lent_on: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('curdate')
    },
    lent_for: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    reservation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    local_only: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'book_share',
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
        using: "BTREE",
        fields: [
          { name: "id_user" },
        ]
      },
      {
        name: "id_book_object",
        using: "BTREE",
        fields: [
          { name: "id_book_object" },
        ]
      },
    ]
  });
  }
}
