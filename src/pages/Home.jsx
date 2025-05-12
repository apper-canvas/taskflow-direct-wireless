import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

// Sample initial data for boards
const initialBoards = [
  {
    id: '1',
    title: 'Product Development',
    description: 'Track progress on our new product features',
    lists: [
      {
        id: 'list-1-1',
        title: 'Backlog',
        cards: [
          { id: 'card-1-1-1', title: 'Redesign navigation menu', description: 'Update the navigation for better UX', labels: ['design', 'ux'] },
          { id: 'card-1-1-2', title: 'User authentication flow', description: 'Implement secure login and registration', labels: ['security'] },
        ]
      },
      {
        id: 'list-1-2',
        title: 'In Progress',
        cards: [
          { id: 'card-1-2-1', title: 'API integration', description: 'Connect with third-party services', labels: ['backend'] },
        ]
      },
      {
        id: 'list-1-3',
        title: 'Review',
        cards: [
          { id: 'card-1-3-1', title: 'Dashboard analytics', description: 'Create data visualization components', labels: ['frontend', 'analytics'] },
        ]
      },
      {
        id: 'list-1-4',
        title: 'Done',
        cards: [
          { id: 'card-1-4-1', title: 'User settings page', description: 'Allow users to customize their profiles', labels: ['frontend'] },
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Marketing Campaign',
    description: 'Q3 marketing initiatives',
    lists: [
      {
        id: 'list-2-1',
        title: 'To Do',
        cards: [
          { id: 'card-2-1-1', title: 'Social media strategy', description: 'Define content plans for each platform', labels: ['planning'] },
        ]
      },
      {
        id: 'list-2-2',
        title: 'In Progress',
        cards: [
          { id: 'card-2-2-1', title: 'Email newsletter', description: 'Create template for monthly updates', labels: ['content'] },
        ]
      },
      {
        id: 'list-2-3',
        title: 'Complete',
        cards: [
          { id: 'card-2-3-1', title: 'SEO optimization', description: 'Improve website ranking for key terms', labels: ['technical'] },
        ]
      }
    ]
  }
];

const Home = () => {
  const [boards, setBoards] = useState(() => {
    const savedBoards = localStorage.getItem('taskflow-boards');
    return savedBoards ? JSON.parse(savedBoards) : initialBoards;
  });
  
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');

  // Declare all icons at the top
  const PlusIcon = getIcon('Plus');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const LayoutIcon = getIcon('LayoutDashboard');
  const ClipboardIcon = getIcon('Clipboard');
  const XIcon = getIcon('X');
  
  useEffect(() => {
    localStorage.setItem('taskflow-boards', JSON.stringify(boards));
  }, [boards]);

  const handleCreateBoard = () => {
    if (newBoardTitle.trim() === '') {
      toast.error('Board title cannot be empty');
      return;
    }

    const newBoard = {
      id: Date.now().toString(),
      title: newBoardTitle,
      description: newBoardDescription,
      lists: [
        {
          id: `list-${Date.now()}-1`,
          title: 'To Do',
          cards: []
        },
        {
          id: `list-${Date.now()}-2`,
          title: 'In Progress',
          cards: []
        },
        {
          id: `list-${Date.now()}-3`,
          title: 'Done',
          cards: []
        }
      ]
    };

    setBoards([...boards, newBoard]);
    setNewBoardTitle('');
    setNewBoardDescription('');
    setIsCreatingBoard(false);
    toast.success('New board created!');
  };

  const handleSelectBoard = (boardId) => {
    const board = boards.find(b => b.id === boardId);
    setSelectedBoard(board);
  };

  const handleBackToBoards = () => {
    setSelectedBoard(null);
  };

  const handleUpdateBoard = (updatedBoard) => {
    const updatedBoards = boards.map(board => 
      board.id === updatedBoard.id ? updatedBoard : board
    );
    setBoards(updatedBoards);
    setSelectedBoard(updatedBoard);
  };

  const handleDeleteBoard = (boardId) => {
    if (confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      const updatedBoards = boards.filter(board => board.id !== boardId);
      setBoards(updatedBoards);
      setSelectedBoard(null);
      toast.info('Board deleted');
    }
  };

  return (
    <div>
      {selectedBoard ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <button 
              className="flex items-center text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
              onClick={handleBackToBoards}
            >
              <ArrowLeftIcon size={20} />
              <span className="ml-2">Back to boards</span>
            </button>
            <button 
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2"
              onClick={() => handleDeleteBoard(selectedBoard.id)}
              aria-label="Delete board"
            >
              <XIcon size={20} />
            </button>
          </div>
          <MainFeature board={selectedBoard} onUpdateBoard={handleUpdateBoard} />
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Your Boards</h2>
            <button 
              className="btn btn-primary flex items-center"
              onClick={() => setIsCreatingBoard(true)}
            >
              <PlusIcon size={18} className="mr-1" />
              New Board
            </button>
          </div>

          {isCreatingBoard && (
            <motion.div 
              className="mb-8 glass-panel p-5"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">Create New Board</h3>
                <button 
                  className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                  onClick={() => setIsCreatingBoard(false)}
                >
                  <XIcon size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="board-title" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Board Title
                  </label>
                  <input
                    id="board-title"
                    type="text"
                    className="input"
                    value={newBoardTitle}
                    onChange={(e) => setNewBoardTitle(e.target.value)}
                    placeholder="Enter board title"
                  />
                </div>
                <div>
                  <label htmlFor="board-description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    id="board-description"
                    className="input min-h-[80px]"
                    value={newBoardDescription}
                    onChange={(e) => setNewBoardDescription(e.target.value)}
                    placeholder="What is this board for?"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button 
                    className="btn btn-outline"
                    onClick={() => setIsCreatingBoard(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={handleCreateBoard}
                  >
                    Create Board
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {boards.length === 0 ? (
            <div className="bg-surface-100 dark:bg-surface-800 rounded-xl p-6 text-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-surface-200 dark:bg-surface-700 text-surface-500 dark:text-surface-400 mb-4">
                <ClipboardIcon size={24} />
              </div>
              <h3 className="text-lg font-medium mb-2">No boards yet</h3>
              <p className="text-surface-500 dark:text-surface-400 mb-4">
                Create your first board to get started organizing your tasks
              </p>
              <button 
                className="btn btn-primary inline-flex items-center"
                onClick={() => setIsCreatingBoard(true)}
              >
                <PlusIcon size={18} className="mr-1" />
                Create Board
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {boards.map(board => (
                <motion.div
                  key={board.id}
                  className="card cursor-pointer hover:border hover:border-primary-light transition-all"
                  whileHover={{ y: -5 }}
                  onClick={() => handleSelectBoard(board.id)}
                >
                  <div className="flex items-start mb-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-light mr-3">
                      <LayoutIcon size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{board.title}</h3>
                      <p className="text-surface-500 dark:text-surface-400 text-sm line-clamp-2">
                        {board.description || "No description"}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-surface-500 dark:text-surface-400">
                    <span>{board.lists.length} lists</span>
                    <span>{board.lists.reduce((total, list) => total + list.cards.length, 0)} cards</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;