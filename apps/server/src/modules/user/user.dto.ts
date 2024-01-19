interface BaseUserDTO {
  name: string
  email: string
}

export interface UserResponseDTO extends BaseUserDTO {
  id: number
}

export interface UserCreateDTO extends BaseUserDTO {}
