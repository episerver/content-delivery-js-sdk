import { ContentData, ContentResolver, ResolvedContent } from '@episerver/content-delivery';

const pending = ref<boolean>(false);
const resolvedContent = reactive<ResolvedContent<ContentData>>({} as ResolvedContent<ContentData>);

export default () => {
  const updateContentByUrl = async (url: string) => {
    pending.value = true;

    const contentResolver = new ContentResolver();
    const result = await contentResolver.resolveContent(url, true);

    Object.assign(resolvedContent, result);

    pending.value = false;
  };

  return {
    pending,
    resolvedContent: readonly(resolvedContent),
    updateContentByUrl
  }
}
