<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" :maximized="$q.screen.lt.sm">
    <q-card class="q-dialog-plugin column" style="width: 720px; max-width: 95vw; min-height: 400px; height: 100%;">
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">{{ t('dialog.filesystem_tree.title', { name: mapName }) }}</div>
        <div class="row q-gutter-sm">
          <q-btn dense flat icon="create_new_folder" @click="createFolder" />
          <q-btn dense flat icon="drive_file_rename_outline" @click="renameFolder" />
        </div>
      </q-card-section>

      <div class="col q-pa-none" style="overflow-y: auto; min-height: 200px;">
        <q-card-section class="q-pa-none">
          <q-tree
            v-model:selected="selectedKey"
            v-model:expanded="expandedKeys"
            :nodes="treeNodes"
            node-key="key"
            selected-color="primary"
            @lazy-load="onLazyLoad"
          >
            <template #default-header="prop">
              <div class="row items-center no-wrap full-width">
                <q-icon :name="prop.node.isFolder ? 'folder' : 'description'" size="18px" class="q-mr-sm" />
                <span class="ellipsis">{{ prop.node.label }}</span>
              </div>
            </template>
          </q-tree>
        </q-card-section>
      </div>

      <q-card-actions align="right">
        <q-btn flat :label="t('dialog.actions.cancel')" color="primary" @click="onDialogCancel" />
        <q-btn flat :label="t('dialog.actions.ok')" color="primary" :disable="okDisabled" @click="submit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Dialog, useDialogPluginComponent } from 'quasar';
import request from 'src/API/ajax';
import Alerts from 'src/alerts';
import { t } from 'src/i18n';

interface FsListItem {
  name: string;
  path: string;
  type: 'file' | 'folder';
}

interface FsTreeNode {
  key: string;
  label: string;
  path: string;
  isFolder: boolean;
  lazy?: boolean;
  children?: FsTreeNode[];
}

const props = defineProps<{
  mapID: string;
  mapName: string;
  currentPath?: string;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const selectedKey = ref('');
const expandedKeys = ref<string[]>([]);
const treeNodes = ref<FsTreeNode[]>([
  {
    key: '/',
    label: '/',
    path: '/',
    isFolder: true,
    lazy: true,
    children: [],
  },
]);

const selectedNode = computed(() => findNodeByKey(treeNodes.value, selectedKey.value));
const okDisabled = computed(() => {
  if (!selectedNode.value) return true;
  return !selectedNode.value.isFolder;
});

function normalizePath(targetPath: string) {
  if (!targetPath) return '/';
  let value = targetPath.trim();
  if (!value.startsWith('/')) value = `/${value}`;
  value = value.replace(/\/+$/g, '');
  return value || '/';
}

function findNodeByKey(nodes: FsTreeNode[], key: string): FsTreeNode | null {
  for (const node of nodes) {
    if (node.key === key) return node;
    if (node.children?.length) {
      const child = findNodeByKey(node.children, key);
      if (child) return child;
    }
  }
  return null;
}

async function loadFolder(folderPath: string): Promise<FsTreeNode[] | null> {
  const path = normalizePath(folderPath);
  const data = (await request<FsListItem[]>('fs.list', { path }, 'post')) as false | FsListItem[];
  if (!data) {
    Alerts.error('dialog.filesystem_tree.errors.read_folder');
    return null;
  }

  return data.map((item) => ({
    key: normalizePath(item.path),
    label: item.name,
    path: normalizePath(item.path),
    isFolder: item.type === 'folder',
    lazy: item.type === 'folder',
    children: [],
  }));
}

async function reloadFolder(folderPath: string) {
  const node = findNodeByKey(treeNodes.value, normalizePath(folderPath));
  if (!node || !node.isFolder) return;
  const children = await loadFolder(node.path);
  if (!children) return;
  node.children = children;
  node.lazy = false;
}

async function onLazyLoad({ node, done, fail }: { node: FsTreeNode; done: (children: FsTreeNode[]) => void; fail: () => void }) {
  const children = await loadFolder(node.path);
  if (!children) {
    fail();
    return;
  }
  done(children);
}

async function expandPath(fullPath: string) {
  const normalizedPath = normalizePath(fullPath);
  const segments = normalizedPath.split('/').filter(Boolean);

  let current = '/';
  if (!expandedKeys.value.includes('/')) expandedKeys.value.push('/');
  await reloadFolder('/');

  for (const segment of segments) {
    const next = current === '/' ? `/${segment}` : `${current}/${segment}`;
    if (!expandedKeys.value.includes(next)) expandedKeys.value.push(next);
    await reloadFolder(next);
    current = next;
  }
}

async function handleCreateFolder(name: string, targetPath: string) {
  const result = await request('fs.create', { path: targetPath, name }, 'post');
  if (!result) {
    Alerts.error('dialog.filesystem_tree.errors.create_folder');
    return;
  }
  await reloadFolder(targetPath);
}

function createFolder() {
  const targetPath = selectedNode.value?.isFolder ? selectedNode.value.path : '/';

  Dialog.create({
    title: t('dialog.filesystem_tree.create.title'),
    message: t('dialog.filesystem_tree.create.message'),
    prompt: {
      model: '',
      type: 'text',
    },
    cancel: true,
    persistent: true,
  }).onOk((name: string) => {
    void handleCreateFolder(name, targetPath);
  });
}

async function handleRenameFolder(sourcePath: string, newName: string) {
  const result = await request('fs.rename', { path: sourcePath, newName }, 'post');
  if (!result) {
    Alerts.error('dialog.filesystem_tree.errors.rename_folder');
    return;
  }

  const parentPath = sourcePath.substring(0, sourcePath.lastIndexOf('/')) || '/';
  await reloadFolder(parentPath);
  selectedKey.value = '';
}

function renameFolder() {
  if (!selectedNode.value || !selectedNode.value.isFolder || selectedNode.value.path === '/') {
    Alerts.warning('dialog.filesystem_tree.errors.select_folder_to_rename');
    return;
  }

  Dialog.create({
    title: t('dialog.filesystem_tree.rename.title'),
    message: t('dialog.filesystem_tree.rename.message'),
    prompt: {
      model: selectedNode.value.label,
      type: 'text',
    },
    cancel: true,
    persistent: true,
  }).onOk((newName: string) => {
    const sourcePath = selectedNode.value?.path;
    if (!sourcePath) return;

    void handleRenameFolder(sourcePath, newName);
  });
}

function submit() {
  if (okDisabled.value || !selectedNode.value) return;
  onDialogOK({
    path: selectedNode.value.path,
  });
}

onMounted(async () => {
  const current = (await request<{ path: string }>('fs.current', {}, 'get')) as false | { path: string };
  if (!current) {
    Alerts.error('dialog.filesystem_tree.errors.read_server_folder');
    return;
  }

  await expandPath(current.path);

  if (props.currentPath) {
    await expandPath(props.currentPath);
    const existingNode = findNodeByKey(treeNodes.value, normalizePath(props.currentPath));
    if (existingNode) {
      selectedKey.value = existingNode.key;
      return;
    }
  }

  const serverFolder = findNodeByKey(treeNodes.value, normalizePath(current.path));
  if (serverFolder) selectedKey.value = serverFolder.key;
});
</script>
