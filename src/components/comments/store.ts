import { defineStore } from 'pinia'
import { sortBy } from 'lodash-es'

interface State {
  comments: any[]
  mode: 'none' | 'edit' | 'reply',
  selectedComment?: object
}

export const useCommentsStore = defineStore('comments', {
  state: () => {
    return {
      comments: [],
      mode: 'none',
      selectedComment: null,
    } as State
  },
  actions: {
    setSelectedComment(selectedComment = null, mode = null) {
      this.selectedComment = selectedComment
      this.mode = mode
    },

    addComment(comment: object) {
      if (comment.branch_id > 0) {
        for (let branch of this.comments) {
          if (parseInt(branch.id) === parseInt(comment.branch_id)) {
            if (! Object.hasOwn(branch, 'replies')) {
              branch.replies = []
            }
            branch.replies.push(comment)
            branch.branch_replies_count++
            break
          }
        }
      } else {
        this.comments.unshift(comment)
      }

      sortBy(comment.replies, 'id')

      this.setSelectedComment()
    },
  },
  getters: {
    isEdit:  (state) => state.selectedComment?.id > 0 && state.mode === 'edit',
    isReply: (state) => state.mode === 'reply'
  },
})