import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { useConfirm } from '../context/ConfirmContext';

const MainFeature = ({ board, onUpdateBoard }) => {
  const [lists, setLists] = useState(board.lists || []);
  const [activeCard, setActiveCard] = useState(null);
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);
  const [showAddList, setShowAddList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [showAddCard, setShowAddCard] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [editingListId, setEditingListId] = useState(null);
  const [editingListTitle, setEditingListTitle] = useState('');
  const confirm = useConfirm();
  
  // Declare all icons at the top
  const PlusIcon = getIcon('Plus');
  const TagIcon = getIcon('Tag');
  const PencilIcon = getIcon('Pencil');
  const TrashIcon = getIcon('Trash2');
  const CheckIcon = getIcon('Check');
  const XIcon = getIcon('X');
  const MoreVerticalIcon = getIcon('MoreVertical');
  const CalendarIcon = getIcon('Calendar');
  const ClipboardListIcon = getIcon('ClipboardList');
  
  // Update the state when board changes
  useEffect(() => {
    setLists(board.lists || []);
  }, [board]);

  // Save changes to parent component when lists change
  useEffect(() => {
    const updatedBoard = { ...board, lists };
    onUpdateBoard(updatedBoard);
  }, [lists]);

  const handleAddList = () => {
    if (newListTitle.trim() === '') {
      toast.error('List title cannot be empty');
      return;
    }
    
    const newList = {
      id: `list-${Date.now()}`,
      title: newListTitle,
      cards: []
    };
    
    setLists([...lists, newList]);
    setNewListTitle('');
    setShowAddList(false);
    toast.success('New list added');
  };

  const handleAddCard = (listId) => {
    if (newCardTitle.trim() === '') {
      toast.error('Card title cannot be empty');
      return;
    }
    
    const newCard = {
      id: `card-${Date.now()}`,
      title: newCardTitle,
      description: newCardDescription,
      labels: []
    };
    
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          cards: [...list.cards, newCard]
        };
      }
      return list;
    });
    
    setLists(updatedLists);
    setNewCardTitle('');
    setNewCardDescription('');
    setShowAddCard(null);
    toast.success('New card added');
  };

  const handleDragStart = (e, card, listId) => {
    setDraggedCard({ card, sourceListId: listId });
  };

  const handleDragOver = (e, listId) => {
    e.preventDefault();
    setDraggedOver(listId);
  };

  const handleDrop = (e, targetListId) => {
    e.preventDefault();
    
    if (!draggedCard || draggedCard.sourceListId === targetListId) {
      setDraggedCard(null);
      setDraggedOver(null);
      return;
    }
    
    // Remove card from source list
    const updatedLists = lists.map(list => {
      if (list.id === draggedCard.sourceListId) {
        return {
          ...list,
          cards: list.cards.filter(card => card.id !== draggedCard.card.id)
        };
      }
      return list;
    });
    
    // Add card to target list
    const finalLists = updatedLists.map(list => {
      if (list.id === targetListId) {
        return {
          ...list,
          cards: [...list.cards, draggedCard.card]
        };
      }
      return list;
    });
    
    setLists(finalLists);
    setDraggedCard(null);
    setDraggedOver(null);
    toast.info('Card moved to new list');
  };

  const handleEditList = (listId) => {
    const list = lists.find(l => l.id === listId);
    setEditingListId(listId);
    setEditingListTitle(list.title);
  };

  const saveListTitle = () => {
    if (editingListTitle.trim() === '') {
      toast.error('List title cannot be empty');
      return;
    }
    
    const updatedLists = lists.map(list => {
      if (list.id === editingListId) {
        return {
          ...list,
          title: editingListTitle
        };
      }
      return list;
    });
    
    setLists(updatedLists);
    setEditingListId(null);
    toast.success('List title updated');
  };

  const handleDeleteList = async (listId) => {
    const result = await confirm({
      title: 'Delete List',
      message: 'Are you sure you want to delete this list and all its cards?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });
    
    if (result) {
      const updatedLists = lists.filter(list => list.id !== listId);
      setLists(updatedLists);
      toast.info('List deleted');
    }
  };

  const handleDeleteCard = async (listId, cardId) => {
    const result = await confirm({
      title: 'Delete Card',
      message: 'Are you sure you want to delete this card?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });
    
    if (result) {
      const updatedLists = lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.filter(card => card.id !== cardId)
          };
        }
        return list;
      });
      
      setLists(updatedLists);
      setActiveCard(null);
      toast.info('Card deleted');
    }
  };

  const getRandomLabelColor = () => {
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const addLabelToCard = (listId, cardId, labelText) => {
    if (!labelText || labelText.trim() === '') return;
    
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          cards: list.cards.map(card => {
            if (card.id === cardId) {
              return {
                ...card,
                labels: [...(card.labels || []), labelText]
              };
            }
            return card;
          })
        };
      }
      return list;
    });
    
    setLists(updatedLists);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{board.title}</h1>
        <p className="text-surface-600 dark:text-surface-400">{board.description}</p>
      </div>
      
      {/* Kanban Board Container */}
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex space-x-4 min-h-[calc(100vh-250px)]">
          {/* Render Lists */}
          {lists.map(list => (
            <div 
              key={list.id}
              className={`kanban-list ${draggedOver === list.id ? 'border-2 border-dashed border-primary' : ''}`}
              onDragOver={(e) => handleDragOver(e, list.id)}
              onDrop={(e) => handleDrop(e, list.id)}
            >
              {/* List Header */}
              <div className="flex justify-between items-center mb-3">
                {editingListId === list.id ? (
                  <div className="flex items-center space-x-2 w-full">
                    <input 
                      type="text"
                      className="input py-1 text-sm"
                      value={editingListTitle}
                      onChange={(e) => setEditingListTitle(e.target.value)}
                      autoFocus
                    />
                    <button 
                      className="text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300"
                      onClick={saveListTitle}
                    >
                      <CheckIcon size={16} />
                    </button>
                    <button 
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => setEditingListId(null)}
                    >
                      <XIcon size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-surface-700 dark:text-surface-200 text-sm">
                      {list.title} <span className="text-surface-500 dark:text-surface-400 ml-1">({list.cards.length})</span>
                    </h3>
                    <div className="relative group">
                      <button className="p-1 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200">
                        <MoreVerticalIcon size={16} />
                      </button>
                      <div className="absolute right-0 mt-1 bg-white dark:bg-surface-800 shadow-lg rounded-lg py-1 w-36 z-10 hidden group-hover:block">
                        <button 
                          className="w-full text-left px-3 py-1.5 text-sm hover:bg-surface-100 dark:hover:bg-surface-700 flex items-center"
                          onClick={() => handleEditList(list.id)}
                        >
                          <PencilIcon size={14} className="mr-2" />
                          Edit List
                        </button>
                        <button 
                          className="w-full text-left px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                          onClick={() => handleDeleteList(list.id)}
                        >
                          <TrashIcon size={14} className="mr-2" />
                          Delete List
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* List Cards Container */}
              <div className="space-y-2 mb-3 min-h-[50px]">
                {list.cards.map(card => (
                  <div 
                    key={card.id}
                    className={`kanban-card ${draggedCard && draggedCard.card.id === card.id ? 'opacity-50' : ''}`}
                    onClick={() => setActiveCard({ card, listId: list.id })}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card, list.id)}
                  >
                    <h4 className="font-medium mb-1">{card.title}</h4>
                    {card.description && (
                      <p className="text-surface-500 dark:text-surface-400 text-sm line-clamp-2 mb-2">
                        {card.description}
                      </p>
                    )}
                    {card.labels && card.labels.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {card.labels.map((label, index) => (
                          <span 
                            key={index} 
                            className={`text-xs px-2 py-0.5 rounded-full ${getRandomLabelColor()}`}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Add Card Button/Form */}
              {showAddCard === list.id ? (
                <div className="p-2 bg-white dark:bg-surface-700 rounded-lg">
                  <input
                    type="text"
                    className="input mb-2 text-sm"
                    placeholder="Enter card title"
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle(e.target.value)}
                    autoFocus
                  />
                  <textarea
                    className="input mb-2 text-sm min-h-[60px]"
                    placeholder="Description (optional)"
                    value={newCardDescription}
                    onChange={(e) => setNewCardDescription(e.target.value)}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 text-sm"
                      onClick={() => {
                        setShowAddCard(null);
                        setNewCardTitle('');
                        setNewCardDescription('');
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-primary text-white px-3 py-1 rounded text-sm"
                      onClick={() => handleAddCard(list.id)}
                    >
                      Add Card
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="w-full flex items-center justify-center py-1.5 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 text-sm rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700"
                  onClick={() => setShowAddCard(list.id)}
                >
                  <PlusIcon size={14} className="mr-1" />
                  Add Card
                </button>
              )}
            </div>
          ))}
          
          {/* Add New List */}
          <div className="min-w-[280px] max-w-[280px] md:min-w-[320px] md:max-w-[320px] h-fit">
            {showAddList ? (
              <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-3">
                <input
                  type="text"
                  className="input mb-3 text-sm"
                  placeholder="Enter list title"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  autoFocus
                />
                <div className="flex justify-end space-x-2">
                  <button
                    className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 text-sm"
                    onClick={() => {
                      setShowAddList(false);
                      setNewListTitle('');
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-primary text-white px-3 py-1 rounded text-sm"
                    onClick={handleAddList}
                  >
                    Add List
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="w-full flex items-center justify-center py-3 bg-surface-200/50 hover:bg-surface-200 dark:bg-surface-800/50 dark:hover:bg-surface-800 text-surface-600 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-200 rounded-xl"
                onClick={() => setShowAddList(true)}
              >
                <PlusIcon size={16} className="mr-1" />
                Add New List
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Card Detail Modal */}
      <AnimatePresence>
        {activeCard && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveCard(null)}
          >
            <motion.div 
              className="bg-white dark:bg-surface-800 rounded-xl shadow-lg w-full max-w-md p-5 max-h-[90vh] overflow-y-auto custom-scrollbar"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{activeCard.card.title}</h2>
                <button 
                  className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                  onClick={() => setActiveCard(null)}
                >
                  <XIcon size={20} />
                </button>
              </div>
              
              <div className="text-sm text-surface-500 dark:text-surface-400 mb-4">
                In list: <span className="font-medium">{lists.find(l => l.id === activeCard.listId)?.title}</span>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center text-surface-700 dark:text-surface-300 mb-2">
                  <ClipboardListIcon size={16} className="mr-2" />
                  <h3 className="font-medium">Description</h3>
                </div>
                <p className="text-surface-700 dark:text-surface-300 whitespace-pre-line">
                  {activeCard.card.description || "No description provided."}
                </p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center text-surface-700 dark:text-surface-300 mb-2">
                  <TagIcon size={16} className="mr-2" />
                  <h3 className="font-medium">Labels</h3>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {activeCard.card.labels && activeCard.card.labels.map((label, index) => (
                    <span 
                      key={index} 
                      className={`text-xs px-2 py-1 rounded-full ${getRandomLabelColor()}`}
                    >
                      {label}
                    </span>
                  ))}
                  
                  {(!activeCard.card.labels || activeCard.card.labels.length === 0) && (
                    <p className="text-surface-500 dark:text-surface-400 text-sm">No labels added yet.</p>
                  )}
                </div>
                
                <div className="mt-2 flex items-center">
                  <input 
                    type="text" 
                    className="input text-sm mr-2"
                    placeholder="Add a label"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addLabelToCard(activeCard.listId, activeCard.card.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button 
                    className="btn btn-primary py-1 px-2 text-sm"
                    onClick={(e) => {
                      const input = e.target.previousSibling;
                      addLabelToCard(activeCard.listId, activeCard.card.id, input.value);
                      input.value = '';
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
                <button 
                  className="flex items-center text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  onClick={() => handleDeleteCard(activeCard.listId, activeCard.card.id)}
                >
                  <TrashIcon size={16} className="mr-1" />
                  Delete Card
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;