// Simple room storage utility
// This will help share rooms across different browser instances on the same machine

export const RoomStorage = {
    // Get all rooms
    getAllRooms() {
        try {
            const rooms = localStorage.getItem("planningPokerRooms");
            return rooms ? JSON.parse(rooms) : {};
        } catch (error) {
            console.error("Error getting rooms:", error);
            return {};
        }
    },

    // Get a specific room
    getRoom(roomId) {
        const rooms = this.getAllRooms();
        return rooms[roomId] || null;
    },

    // Save a room
    saveRoom(roomId, roomData) {
        try {
            const rooms = this.getAllRooms();
            rooms[roomId] = {
                ...roomData,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem("planningPokerRooms", JSON.stringify(rooms));

            // Also broadcast the room update to other tabs/windows
            this.broadcastRoomUpdate(roomId, roomData);
            return true;
        } catch (error) {
            console.error("Error saving room:", error);
            return false;
        }
    },

    // Update room data
    updateRoom(roomId, updates) {
        const room = this.getRoom(roomId);
        if (room) {
            const updatedRoom = { ...room, ...updates };
            return this.saveRoom(roomId, updatedRoom);
        }
        return false;
    },

    // Delete a room
    deleteRoom(roomId) {
        try {
            const rooms = this.getAllRooms();
            delete rooms[roomId];
            localStorage.setItem("planningPokerRooms", JSON.stringify(rooms));
            return true;
        } catch (error) {
            console.error("Error deleting room:", error);
            return false;
        }
    },

    // Check if room exists
    roomExists(roomId) {
        return this.getRoom(roomId) !== null;
    },

    // Broadcast room updates to other tabs (using storage events)
    broadcastRoomUpdate(roomId, roomData) {
        try {
            // Use a temporary key to trigger storage events in other tabs
            const updateEvent = {
                type: 'room_update',
                roomId,
                roomData,
                timestamp: Date.now()
            };

            localStorage.setItem('planningPoker_broadcast', JSON.stringify(updateEvent));
            // Remove it immediately so it can be used again
            setTimeout(() => {
                localStorage.removeItem('planningPoker_broadcast');
            }, 100);
        } catch (error) {
            console.error("Error broadcasting room update:", error);
        }
    },

    // Listen for room updates from other tabs
    onRoomUpdate(callback) {
        const handleStorageChange = (event) => {
            if (event.key === 'planningPoker_broadcast' && event.newValue) {
                try {
                    const updateEvent = JSON.parse(event.newValue);
                    if (updateEvent.type === 'room_update') {
                        callback(updateEvent.roomId, updateEvent.roomData);
                    }
                } catch (error) {
                    console.error("Error handling storage change:", error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Return cleanup function
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    },

    // Get room URL for sharing
    getRoomUrl(roomId) {
        return `${window.location.origin}/room/${roomId}`;
    },

    // Clean up old rooms (optional - removes rooms older than 24 hours)
    cleanupOldRooms() {
        try {
            const rooms = this.getAllRooms();
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

            let hasChanges = false;
            Object.keys(rooms).forEach(roomId => {
                const room = rooms[roomId];
                if (room.lastUpdated && room.lastUpdated < oneDayAgo) {
                    delete rooms[roomId];
                    hasChanges = true;
                }
            });

            if (hasChanges) {
                localStorage.setItem("planningPokerRooms", JSON.stringify(rooms));
            }
        } catch (error) {
            console.error("Error cleaning up old rooms:", error);
        }
    }
};
