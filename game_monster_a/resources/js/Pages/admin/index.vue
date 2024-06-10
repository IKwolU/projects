<template>
    <AdminLayout>
        <TitlePage>Заголовок</TitlePage>
    </AdminLayout>
</template>

<script>
import AdminLayout from "@/components/layouts/adminLayout.vue";
import TitlePage from "@/components/admin/news/titlePage.vue";

export default ({
    name: "index",
    props: ['news', 'positions'],
    components: {TitlePage, AdminLayout}
});
</script>

<style scoped>

</style>
