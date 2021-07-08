/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
      id
      name
      messages {
        items {
          id
          userId
          content
          ttl
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
      id
      name
      messages {
        items {
          id
          userId
          content
          ttl
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
      id
      name
      messages {
        items {
          id
          userId
          content
          ttl
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage {
    onCreateMessage {
      id
      userId
      user {
        id
        name
        messages {
          nextToken
        }
        createdAt
        updatedAt
      }
      content
      ttl
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage {
    onUpdateMessage {
      id
      userId
      user {
        id
        name
        messages {
          nextToken
        }
        createdAt
        updatedAt
      }
      content
      ttl
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage {
    onDeleteMessage {
      id
      userId
      user {
        id
        name
        messages {
          nextToken
        }
        createdAt
        updatedAt
      }
      content
      ttl
      createdAt
      updatedAt
    }
  }
`;
