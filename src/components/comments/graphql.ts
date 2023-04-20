
export const REPLY = `
  id
  user_id
  post_id
  branch_id
  parent_id
  text
  created_at
  branch_replies_count
  votes_up_count
  votes_down_count
  rating
  vote {
    type
  }
  parent {
    id
    user_id
    created_at
    text
    user {
      name
      avatar
    }
  }
  user {
    id
    name
    avatar
  }
`;

export const COMMENT = `
  id
  user_id
  post_id
  branch_id
  parent_id
  text
  created_at
  branch_replies_count
  votes_up_count
  votes_down_count
  rating
  vote {
    type
  }
  parent {
    id
    user_id
    created_at
    text
    user {
      name
      avatar
    }
  }
  user {
    id
    name
    avatar
  }
`;
export const CREATE_COMMENT = `
  mutation($input: CommentInput!) {
    comment: createComment(input: $input) {
      ${COMMENT}
    }
  }
`
export const UPDATE_COMMENT = `
  mutation($id: ID!, $input: CommentInput!) {
    comment: updateComment(id: $id, input: $input) {
      ${COMMENT}
    }
  }
`
export const DELETE_COMMENT = `
  mutation($id: Int!) {
    comment: deleteComment(id: $id) {
      ${COMMENT}
    }
  }
`