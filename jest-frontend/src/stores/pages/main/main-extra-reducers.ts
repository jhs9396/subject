import { PayloadAction } from '@reduxjs/toolkit';
import { asyncThunkGraphData, asyncThunkGraphExpandData } from 'stores/pages/main/main-async-thunk';
import { IExpandGraphResponse, IGraphResponse, IMain } from 'stores/pages/main/main-interface';

export const ThunkGraph = {
  [asyncThunkGraphData.pending.type]: (state: IMain): void => {
    state.loading = true;
  },
  [asyncThunkGraphData.fulfilled.type]: (state: IMain, action: IGraphResponse): void => {
    try {
      state.graph = action.payload.data.graph;

      // Status
      state.loading = false;
    } catch (error) {
      console.log('asyncThunkGraphData(fulfilled) Error : ', error);
    }
  },
  [asyncThunkGraphData.rejected.type]: (
    state: IMain,
    action: PayloadAction<{ message: string; code: number }>
  ): void => {
    state.loading = false;
  },
  [asyncThunkGraphExpandData.pending.type]: (state: IMain): void => {
    state.loading = true;
  },
  [asyncThunkGraphExpandData.fulfilled.type]: (state: IMain, action: IExpandGraphResponse): void => {
    try {
      if (action.payload.data.graphExpand) {
        const { nodes, edges } = action.payload.data.graphExpand;
        state.graph = {
          nodes: [...state.graph.nodes, ...nodes].filter(
            (node, index, self) => self.map(s => s.id).indexOf(node.id) === index
          ),
          edges: [...state.graph.edges, ...edges].filter(
            (edge, index, self) =>
              self.map(s => `${s.source}_${s.target}`).indexOf(`${edge.source}_${edge.target}`) === index
          )
        };
      }

      // Status
      state.loading = false;
    } catch (error) {
      console.log('asyncThunkGraphData(fulfilled) Error : ', error);
    }
  },
  [asyncThunkGraphExpandData.rejected.type]: (
    state: IMain,
    action: PayloadAction<{ message: string; code: number }>
  ): void => {
    state.loading = false;
  }
};
