<template>
  <div class="poi-manager q-pa-sm">
    <div class="text-subtitle2 q-px-sm q-pb-sm">{{ $t('menu.view.poi_manager') }}</div>
    <div class="row items-center q-gutter-xs q-px-sm q-pb-sm">
      <q-btn
        dense
        flat
        round
        icon="create_new_folder"
        @click="createFolder()"
      >
        <q-tooltip>{{ $t('menu.view.poi_manager_actions.create') }}</q-tooltip>
      </q-btn>
      <q-btn
        dense
        flat
        round
        icon="drive_file_rename_outline"
        :disable="!canRenameSelectedItem"
        @click="renameSelectedItem()"
      >
        <q-tooltip>{{ $t('menu.view.poi_manager_actions.rename') }}</q-tooltip>
      </q-btn>
      <q-btn
        dense
        flat
        round
        icon="drive_file_move"
        :disable="!canMoveSelectedItem"
        @click="moveSelectedItem()"
      >
        <q-tooltip>{{ $t('menu.view.poi_manager_actions.move') }}</q-tooltip>
      </q-btn>
      <q-btn
        dense
        flat
        round
        icon="delete"
        :disable="!canDeleteSelectedItem"
        @click="deleteSelectedItem()"
      >
        <q-tooltip>{{ $t('menu.view.poi_manager_actions.delete') }}</q-tooltip>
      </q-btn>
    </div>
    <q-tree
      :nodes="nodes"
      node-key="id"
      v-model:selected="selected"
      v-model:expanded="expanded"
    >
      <template #default-header="scope">
        <div class="row items-center no-wrap">
          <q-icon
            :name="getNodeIcon(scope.node, scope.expanded)"
            size="18px"
            class="q-mr-sm"
          />
          <span>{{ scope.node.label }}</span>
        </div>
      </template>
    </q-tree>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { POIFeature, POIFolderItem } from 'src/stores/poi';
import { usePOIStore } from 'src/stores/poi';
import { useI18n } from 'vue-i18n';
import { getMap } from 'src/map/Map';
import { ModalsList, useDialogs } from 'src/composables/useDialogs';
import { usePrompt } from 'src/composables/usePrompt';

type GeometryType = 'Point' | 'LineString' | 'Polygon';

interface POITreeNode {
  id: string;
  label: string;
  nodeType: 'folder' | 'poi';
  folderID?: number | null;
  geometryType?: GeometryType;
  featureID?: string | number;
  children?: Array<POITreeNode>;
}

const ROOT_NODE_ID = 'folder:root';

const { t } = useI18n();
const poiStore = usePOIStore();
const dialogs = useDialogs();
const prompt = usePrompt();
const expanded = ref<Array<string>>([ROOT_NODE_ID]);
const selected = ref<string | null>(ROOT_NODE_ID);

const selectedFolderID = computed<number | null>(() => {
  if (!selected.value) return null;
  if (selected.value === ROOT_NODE_ID) return null;
  if (!selected.value.startsWith('folder:')) return null;

  const folderID = Number(selected.value.replace('folder:', ''));
  return Number.isFinite(folderID) ? folderID : null;
});

const selectedFolder = computed(() => {
  if (typeof selectedFolderID.value !== 'number') return null;
  return poiStore.folders.find((item) => item.ID === selectedFolderID.value) ?? null;
});

const canRenameSelectedItem = computed(() => !!selectedFolder.value || !!selectedPOI.value);
const canDeleteSelectedItem = computed(() => !!selectedFolder.value || !!selectedPOI.value);

const selectedNode = computed<POITreeNode | null>(() => {
  if (!selected.value) return null;
  return findNodeByID(nodes.value, selected.value);
});

const selectedPOI = computed(() => {
  if (selectedNode.value?.nodeType !== 'poi' || selectedNode.value.featureID == null) return null;
  return (
    poiStore.drawings.find((item) => String(item.id) === String(selectedNode.value?.featureID)) ?? null
  );
});

const canMoveSelectedItem = computed(() => !!selectedFolder.value || !!selectedPOI.value);

const nodes = computed<Array<POITreeNode>>(() => {
  return [
    {
      id: ROOT_NODE_ID,
      label: 'POI',
      nodeType: 'folder',
      folderID: null,
      children: getChildrenByFolderID(null, new Set<number>()),
    },
  ];
});

function toFolderNode(folder: POIFolderItem, visited: Set<number>): POITreeNode {
  const nextVisited = new Set(visited);
  nextVisited.add(folder.ID);

  return {
    id: `folder:${folder.ID}`,
    label: folder.name,
    nodeType: 'folder',
    folderID: folder.ID,
    children: getChildrenByFolderID(folder.ID, nextVisited),
  };
}

function toPOINode(feature: POIFeature, index: number): POITreeNode {
  const featureIDRaw = feature.id != null ? feature.id : `idx-${index}`;
  const featureID = String(featureIDRaw);
  const geometryType = feature.geometry.type;
  const labelFromProps = feature.properties?.name;

  return {
    id: `poi:${featureID}`,
    label: typeof labelFromProps === 'string' && labelFromProps.length > 0 ? labelFromProps : featureID,
    nodeType: 'poi',
    featureID: featureIDRaw,
    geometryType: geometryType === 'Point' || geometryType === 'LineString' ? geometryType : 'Polygon',
  };
}

function getChildrenByFolderID(folderID: number | null, visited: Set<number>): Array<POITreeNode> {
  const childFolders = poiStore.folders
    .filter((folder) => folder.parentID === folderID && !visited.has(folder.ID))
    .map((folder) => toFolderNode(folder, visited));

  const childPOI = poiStore.drawings
    .filter((feature) => {
      const featureFolderID =
        typeof feature.properties?.folderID === 'number' ? feature.properties.folderID : null;
      return featureFolderID === folderID;
    })
    .map((feature, index) => toPOINode(feature, index));

  return [...childFolders, ...childPOI];
}

function getNodeIcon(node: POITreeNode, isExpanded: boolean): string {
  if (node.nodeType === 'folder') {
    return isExpanded ? 'folder_open' : 'folder';
  }

  if (node.geometryType === 'Point') return 'place';
  if (node.geometryType === 'LineString') return 'timeline';
  return 'pentagon';
}

function isSelectedFolderStillValid() {
  if (!selected.value || selected.value === ROOT_NODE_ID) return true;
  if (!selected.value.startsWith('folder:')) return true;

  const selectedID = Number(selected.value.replace('folder:', ''));
  if (!Number.isFinite(selectedID)) return false;
  return poiStore.folders.some((item) => item.ID === selectedID);
}

function ensureFolderExpanded(folderID: number | null) {
  const targetNodeID = folderID == null ? ROOT_NODE_ID : `folder:${folderID}`;
  if (!expanded.value.includes(targetNodeID)) {
    expanded.value = [...expanded.value, targetNodeID];
  }
}

async function createFolder() {
  const parentID = selectedFolderID.value;

  const value = (await prompt(
    'menu.view.poi_manager_actions.create',
    'menu.view.poi_manager_actions.create',
    { model: '', type: 'text' },
  )) as string | false;

  if (!value) return;
  const name = value.trim();
  if (!name) return;

  poiStore.addFolder(name, parentID);
  ensureFolderExpanded(parentID);
}

async function renameSelectedItem() {
  if (selectedFolder.value) {
    const value = (await prompt(
      'menu.view.poi_manager_actions.rename',
      'menu.view.poi_manager_actions.rename',
      { model: selectedFolder.value.name, type: 'text' },
    )) as string | false;

    if (!value) return;
    const name = value.trim();
    if (!name || !selectedFolder.value) return;

    poiStore.renameFolder(selectedFolder.value.ID, name);
    return;
  }

  if (!selectedPOI.value) return;

  const currentName =
    typeof selectedPOI.value.properties?.name === 'string'
      ? selectedPOI.value.properties.name
      : String(selectedPOI.value.id ?? '');

  const value = (await prompt(
    'menu.view.poi_manager_actions.rename',
    'menu.view.poi_manager_actions.rename',
    { model: currentName, type: 'text' },
  )) as string | false;

  if (!value) return;
  const name = value.trim();
  if (!name) return;

  poiStore.setDrawings(
    poiStore.drawings.map((item) => {
      if (String(item.id) !== String(selectedPOI.value?.id)) return item;
      return {
        ...item,
        properties: {
          ...(item.properties ?? {}),
          name,
        },
      };
    }),
  );
}

async function moveSelectedItem() {
  if (!selectedFolder.value && !selectedPOI.value) return;

  const allFolderOptions = [
    {
      label: t('menu.view.poi_manager_actions.root'),
      value: 'root',
    },
    ...poiStore.folders.map((item) => ({
      label: item.name,
      value: String(item.ID),
    })),
  ];

  if (selectedFolder.value) {
    const descendants = poiStore.getFolderDescendantIDs(selectedFolder.value.ID);
    const options = allFolderOptions.filter((item) => {
      if (item.value === 'root') return true;
      const optionFolderID = Number(item.value);
      if (!Number.isFinite(optionFolderID)) return false;
      if (optionFolderID === selectedFolder.value?.ID) return false;
      return !descendants.includes(optionFolderID);
    });

    const model =
      typeof selectedFolder.value.parentID === 'number'
        ? String(selectedFolder.value.parentID)
        : 'root';

    const value = (await dialogs(ModalsList.POIMove, {
      options,
      model,
    })) as string | false;

    if (!value) return;
    const targetParentID = value === 'root' ? null : Number(value);
    if (value !== 'root' && !Number.isFinite(targetParentID)) return;
    poiStore.moveFolder(selectedFolder.value.ID, targetParentID);
    ensureFolderExpanded(targetParentID);
    return;
  }

  const currentPOIFolderID =
    typeof selectedPOI.value?.properties?.folderID === 'number'
      ? selectedPOI.value.properties.folderID
      : null;

  const value = (await dialogs(ModalsList.POIMove, {
    options: allFolderOptions,
    model: currentPOIFolderID == null ? 'root' : String(currentPOIFolderID),
  })) as string | false;

  if (!value) return;
  const targetParentID = value === 'root' ? null : Number(value);
  if (value !== 'root' && !Number.isFinite(targetParentID)) return;
  if (!selectedPOI.value) return;

  poiStore.setDrawings(
    poiStore.drawings.map((item) => {
      if (String(item.id) !== String(selectedPOI.value?.id)) return item;
      return {
        ...item,
        properties: {
          ...(item.properties ?? {}),
          folderID: targetParentID,
        },
      };
    }),
  );

  ensureFolderExpanded(targetParentID);
}

async function deleteSelectedItem() {
  if (selectedFolder.value) {
    const confirmed = (await prompt(
      'menu.view.poi_manager_actions.delete_title',
      'menu.view.poi_manager_actions.delete_confirm',
      {
        confirmOnly: true,
        messageParams: { name: selectedFolder.value.name },
      },
    )) as boolean;

    if (!confirmed) return;

    const deleteID = selectedFolder.value?.ID;
    const parentID = selectedFolder.value?.parentID ?? null;
    if (typeof deleteID !== 'number') return;

    poiStore.deleteFolder(deleteID);
    selected.value = parentID == null ? ROOT_NODE_ID : `folder:${parentID}`;
    ensureFolderExpanded(parentID);
    return;
  }

  if (!selectedPOI.value) return;

  const poiName =
    typeof selectedPOI.value.properties?.name === 'string'
      ? selectedPOI.value.properties.name
      : String(selectedPOI.value.id ?? '');

  const confirmed = (await prompt(
    'menu.view.poi_manager_actions.delete_title',
    'menu.view.poi_manager_actions.delete_poi_confirm',
    {
      confirmOnly: true,
      messageParams: { name: poiName },
    },
  )) as boolean;

  if (!confirmed) return;

  const poiID = selectedPOI.value?.id;
  const parentID =
    typeof selectedPOI.value?.properties?.folderID === 'number'
      ? selectedPOI.value.properties.folderID
      : null;

  poiStore.setDrawings(poiStore.drawings.filter((item) => String(item.id) !== String(poiID)));
  selected.value = parentID == null ? ROOT_NODE_ID : `folder:${parentID}`;
  ensureFolderExpanded(parentID);
}

function flyToFeature(node: POITreeNode) {
  if (node.nodeType !== 'poi' || node.featureID == null) return;

  const feature = poiStore.drawings.find((item) => String(item.id) === String(node.featureID));
  if (!feature) return;

  const map = getMap().init();
  if (!map) return;

  if (feature.geometry.type === 'Point') {
    const coordinates = feature.geometry.coordinates;
    const lng = Number(coordinates[0]);
    const lat = Number(coordinates[1]);
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;

    map.flyTo({
      center: [lng, lat],
      zoom: map.getZoom(),
      duration: 700,
      essential: true,
    });
    return;
  }

  const bounds = new maplibregl.LngLatBounds();
  let hasBoundsPoints = false;

  if (feature.geometry.type === 'LineString') {
    feature.geometry.coordinates.forEach((coord) => {
      const lng = Number(coord[0]);
      const lat = Number(coord[1]);
      if (Number.isFinite(lng) && Number.isFinite(lat)) {
        bounds.extend(new maplibregl.LngLat(lng, lat));
        hasBoundsPoints = true;
      }
    });
  }

  if (feature.geometry.type === 'Polygon') {
    feature.geometry.coordinates.forEach((ring) => {
      ring.forEach((coord) => {
        const lng = Number(coord[0]);
        const lat = Number(coord[1]);
        if (Number.isFinite(lng) && Number.isFinite(lat)) {
          bounds.extend(new maplibregl.LngLat(lng, lat));
          hasBoundsPoints = true;
        }
      });
    });
  }

  if (!hasBoundsPoints) return;

  map.fitBounds(bounds, {
    padding: 48,
    duration: 800,
  });
}

watch(
  () => poiStore.folders.map((item) => item.ID).join('|'),
  () => {
    if (!isSelectedFolderStillValid()) {
      selected.value = ROOT_NODE_ID;
    }
  },
);

watch(
  () => selected.value,
  () => {
  if (!isSelectedFolderStillValid()) {
    selected.value = ROOT_NODE_ID;
      return;
    }

    if (!selected.value?.startsWith('poi:')) return;
    const node = findNodeByID(nodes.value, selected.value);
    if (!node) return;
    flyToFeature(node);
  },
);

function findNodeByID(treeNodes: Array<POITreeNode>, nodeID: string): POITreeNode | null {
  for (const node of treeNodes) {
    if (node.id === nodeID) return node;
    if (!node.children || node.children.length === 0) continue;
    const found = findNodeByID(node.children, nodeID);
    if (found) return found;
  }
  return null;
}
</script>

<style scoped>
.poi-manager {
  height: 100%;
  overflow-y: auto;
}
</style>
