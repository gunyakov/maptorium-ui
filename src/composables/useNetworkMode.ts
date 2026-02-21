//-------------------------------------------------------------------------
// Import modules and vue functions
//-------------------------------------------------------------------------
import request from 'src/API/ajax';
import { NetworkMode } from 'src/enum';
import { ref } from 'vue';
//-------------------------------------------------------------------------
// var to keep current network mode inside
//-------------------------------------------------------------------------
const mode = ref(NetworkMode.null);
//-------------------------------------------------------------------------
// Export composable with mode and mode setter
//-------------------------------------------------------------------------
export const useNetworkMode = () => {
  //-----------------------------------------------------------------------
  // Set mode on server and update local value on success
  //-----------------------------------------------------------------------
  const set = async (newMode: NetworkMode): Promise<void> => {
    const result = await request<boolean>('core.mode', { mode: newMode }, 'post', true);
    if (result) {
      mode.value = newMode;
    }
  };

  return {
    set,
    mode,
  };
};

//-------------------------------------------------------------------------
// Export the type of the network mode store instance
//-------------------------------------------------------------------------
export type NetworkModeStore = ReturnType<typeof useNetworkMode>;
