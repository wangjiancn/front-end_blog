<template>
  <div class="post-container">
    <div v-if="items.length">
      <div
        v-for="item in items"
        :key="item.id"
        class="post"
      >
        <div class="post-body">
          <h1 class="post-title">
            <router-link :to="`/post/${item.id}`">{{ item.title }}</router-link>
          </h1>
          <div class="post-meta">
            <span class="post-meta-item">
              <img
                alt="访问量"
                class="post-meta-img"
                src="@/accets/img/author.png"
              >
              {{ item.author ? item.author.nickname || item.author.username : '' }}</span>
            <span class="post-meta-item">
              <img
                alt="访问量"
                class="post-meta-img"
                src="@/accets/img/update.png"
              >
              {{ $dayjs(item.last_modified,{locale:'zh-cn'}).fromNow() }}</span>
            <span
              v-if="item.cat"
              class="post-meta-item"
            >分类: <router-link :to="{name:'cat',params:{name:item.cat.name}}">{{ item.cat.name }}</router-link> </span>
            <span class="post-meta-item">
              <router-link
                v-for="tag in item.tags"
                :key="tag.uuid"
                class="tag-item"
                :to="{name:'tag',params:{name:tag.name}}"
              >
                <img
                  alt="访问量"
                  class="post-meta-img"
                  src="@/accets/img/tag.png"
                >
                {{ tag.name }}</router-link>
            </span>
            <span class="post-meta-item">
              <img
                alt="访问量"
                class="post-meta-img"
                src="@/accets/img/eye.png"
              > {{ item.views_count }}</span>
          </div>
          <div class="post-desc">{{ item.desc }}</div>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          background
          :current-page="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="total"
          @prev-click="handlePageChange"
          @current-change="handlePageChange"
        >
        </el-pagination>
      </div>
    </div>
    <div v-else>
      <p class="text-center">没有相关文章</p>
    </div>
  </div>
</template>

<script>
import { fetchArticles } from '@/api/article'

export default {
  data() {
    return {
      items: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      title: '',
    }
  },
  metaInfo() {
    return {
      title: this.title || '主页',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: '文章列表',
        },
        {
          vmid: 'keywords',
          name: 'keywords',
          content: 'python,python入门,python转行',
        },
      ],
    }
  },
  computed: {
    pageCount: function() {
      return Math.ceil(this.total / this.pageSize)
    },
  },
  watch: {
    $route() {
      this.currentPage = 1
      this.loadItems()
    },
  },
  async created() {
    this.loadItems()
  },
  methods: {
    async loadItems() {
      this.title = ''
      let query = {
        ...this.$route.query,
        limit: this.pageSize,
        offset: (this.currentPage - 1) * this.pageSize,
        defer: 'markdown,body',
        order_by: '-created',
        private: 0,
        is_publish: 1,
        rate__gt: 3,
        post_type: this.$route.params.type || 'article',
      }
      const paramName = this.$route.params.name
      const routeName = this.$route.name
      if (paramName && routeName) {
        if (routeName === 'tag') {
          query.tags__name = paramName
          this.title = paramName + ' - ' + '标签'
        } else if (routeName === 'cat') {
          query.cat__name = paramName
          this.title = paramName
        }
      }
      const {
        data: { objects, meta },
      } = await fetchArticles(query)
      this.items = objects
      this.total = meta.total_count
    },
    handlePageChange(page) {
      this.currentPage = page
      this.loadItems()
    },
  },
}
</script>

<style lang="scss" scoped>
.post-container {
  width: 100%;
}
.post {
  margin-bottom: 0.6rem;
  border-bottom: 1px solid #999999;
  width: 100%;
  padding: 3px;
  .post-body {
    margin: 3px;
  }
  .post-title {
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.1rem;
    margin: 0 auto;
    text-align: left;
    width: 100%;
  }
  .post-meta {
    font-size: 0.7rem;
    color: #888888;
    line-height: 1.2rem;
    &-item {
      font-size: 0.7rem;
      color: #888888;
      display: inline-block;
      padding-right: 5px;
      .tag-item {
        padding-right: 3px;
      }
    }
    &-img {
      height: 0.8rem;
      width: auto;
    }
  }
  .post-desc {
    display: inline-block;
    margin: 0;
    font-size: 0.9rem;
    white-space: pre-wrap;
    width: 100%;
  }
  a,
  a:hover,
  a:active {
    text-decoration: none;
    color: inherit;
  }
}
.pagination {
  // position: absolute;
  bottom: 10px;

  // 居中方案
  // case1
  width: 100%;
  text-align: center;
  margin-bottom: -40px;

  //case2
  // width: 100%;
  // display: flex;

  // case3
  // left: 48%;
  // transform: translateX(-50%);
}
</style>
