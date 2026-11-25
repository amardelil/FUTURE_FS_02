export const jsonOptions = {
  versionKey: false,
  transform: (_doc: unknown, ret: Record<string, unknown>) => {
    ret.id = String(ret._id)
    delete ret._id
    delete ret.owner
    delete ret.passwordHash
    return ret
  },
}
