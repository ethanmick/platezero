import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript'

import { ProcedureLine } from './procedure_line'
import { ProcedureList } from './procedure_list'

@Table({
  tableName: 'procedure_list_lines'
})
export class ProcedureListLine extends Model<ProcedureListLine> {
  @AllowNull(false)
  @Column
  @ForeignKey(() => ProcedureList)
  public procedure_list_id: number

  @AllowNull(false)
  @Column
  @ForeignKey(() => ProcedureLine)
  public procedure_line_id: number

  @Column public sort_key: number

  @BelongsTo(() => ProcedureList)
  public procedureList: ProcedureList

  @BelongsTo(() => ProcedureLine)
  public procedureLine: ProcedureLine
}