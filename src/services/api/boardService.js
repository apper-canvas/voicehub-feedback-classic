import boardsData from "@/services/mockData/boards.json";

let boards = [...boardsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const boardService = {
  async getAll() {
    await delay(300);
    return [...boards];
  },

  async getById(id) {
    await delay(200);
    const board = boards.find(board => board.Id === parseInt(id));
    if (!board) {
      throw new Error("Board not found");
    }
    return { ...board };
  },

  async create(boardData) {
    await delay(400);
    const newBoard = {
      ...boardData,
      Id: Math.max(...boards.map(b => b.Id), 0) + 1,
      postCount: 0,
      memberCount: 1,
      settings: {
        allowAnonymous: true,
        requireApproval: false,
        allowVoting: true
      },
      createdAt: new Date().toISOString()
    };
    boards.push(newBoard);
    return { ...newBoard };
  },

  async update(id, boardData) {
    await delay(400);
    const index = boards.findIndex(board => board.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Board not found");
    }
    
    boards[index] = {
      ...boards[index],
      ...boardData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...boards[index] };
  },

  async delete(id) {
    await delay(300);
    const index = boards.findIndex(board => board.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Board not found");
    }
    
    const deletedBoard = boards.splice(index, 1)[0];
    return { ...deletedBoard };
  },

  async incrementPostCount(boardId) {
    const board = boards.find(b => b.Id === parseInt(boardId));
    if (board) {
      board.postCount = (board.postCount || 0) + 1;
    }
  },

  async decrementPostCount(boardId) {
    const board = boards.find(b => b.Id === parseInt(boardId));
    if (board && board.postCount > 0) {
      board.postCount -= 1;
    }
  }
};