import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type {
  AddVoyageResourceResponseDto,
  VoyageResource,
} from "@chingu-x/modules/voyage-resources";

interface AddVoyageResourceStateProps {
  data: AddVoyageResourceResponseDto;
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

const initialState: {
  voyageResources: VoyageResource[];
} = {
  voyageResources: [],
};

export const voyageResourcesSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {
    fetchVoyageResourcesState: (
      state,
      action: PayloadAction<VoyageResource[]>,
    ) => {
      state.voyageResources = action.payload;
    },
    addVoyageResourceState: (
      state,
      action: PayloadAction<AddVoyageResourceStateProps>,
    ) => {
      const { data, id, firstName, lastName, avatar } = action.payload;

      const newVoyageResource = {
        ...data,
        addedBy: {
          member: {
            id,
            firstName,
            lastName,
            avatar,
          },
        },
      };

      state.voyageResources.push(newVoyageResource);
    },
  },
});

export const { fetchVoyageResourcesState, addVoyageResourceState } =
  voyageResourcesSlice.actions;

export default voyageResourcesSlice.reducer;
