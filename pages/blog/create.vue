<template>
  <client-only>
    <v-container id="blog_create" class="py-0">
      <v-container class="editor">
        <v-row justify="center" no-gutters>
          <v-col cols="10">
            <v-tabs v-model="editor_tab" dark>
              <v-tab @click="refreshEditor()">
                Editor
              </v-tab>
              <v-tab @click="refreshEditor()">
                Raw
              </v-tab>
              <v-tab>Images </v-tab>
              <v-tab @click="refreshEditor()">
                Preview
              </v-tab>
              <v-container
                class="d-flex justify-end align-center text-center"
                aria-selected="true"
              >
                <v-btn
                  @click="
                    isPrimaryLanguage = !isPrimaryLanguage;
                    refreshEditor();
                  "
                >
                  {{ isPrimaryLanguage ? "EN" : "TH" }}
                </v-btn>
              </v-container>
            </v-tabs>
            <v-tabs-items v-model="editor_tab">
              <v-tab-item>
                <v-row no-gutters>
                  <v-col cols="12">
                    <editor-menu-bar
                      v-slot="{ commands, isActive, getMarkAttrs }"
                      :editor="isPrimaryLanguage ? editor : editorTh"
                    >
                      <v-container class="grey lighten-2 py-1">
                        <v-btn
                          text
                          small
                          :class="{ 'is-active': isActive.bold() }"
                          @click="commands.bold"
                        >
                          <v-icon>mdi-format-bold</v-icon>
                        </v-btn>
                        <v-btn
                          text
                          small
                          :class="{ 'is-active': isActive.italic() }"
                          @click="commands.italic"
                        >
                          <v-icon>mdi-format-italic</v-icon>
                        </v-btn>

                        <v-btn
                          text
                          small
                          :class="{ 'is-active': isActive.strike() }"
                          @click="commands.strike"
                        >
                          <v-icon>mdi-format-strikethrough</v-icon>
                        </v-btn>

                        <v-btn
                          text
                          small
                          :class="{ 'is-active': isActive.underline() }"
                          @click="commands.underline"
                        >
                          <v-icon>mdi-format-underline</v-icon>
                        </v-btn>

                        <v-btn
                          text
                          small
                          :class="{ 'is-active': isActive.code() }"
                          @click="commands.code"
                        >
                          <v-icon>mdi-code-braces</v-icon>
                        </v-btn>

                        <v-btn
                          text
                          small
                          :class="{ 'is-active': isActive.paragraph() }"
                          @click="commands.paragraph"
                        >
                          <v-icon>mdi-format-paragraph</v-icon>
                        </v-btn>

                        <v-btn
                          text
                          small
                          :class="{
                            'is-active': isActive.heading({ level: 1 }),
                          }"
                          @click="commands.heading({ level: 1 })"
                        >
                          <v-icon>mdi-format-header-1</v-icon>
                        </v-btn>

                        <v-btn
                          text
                          small
                          :class="{
                            'is-active': isActive.heading({ level: 2 }),
                          }"
                          @click="commands.heading({ level: 2 })"
                        >
                          <v-icon>mdi-format-header-2</v-icon>
                        </v-btn>

                        <v-btn
                          text
                          small
                          :class="{
                            'is-active': isActive.heading({ level: 3 }),
                          }"
                          @click="commands.heading({ level: 3 })"
                        >
                          <v-icon>mdi-format-header-3</v-icon>
                        </v-btn>

                        <v-btn
                          text
                          small
                          :class="{ 'is-active': isActive.bullet_list() }"
                          @click="commands.bullet_list"
                        >
                          <v-icon>mdi-format-list-bulleted</v-icon>
                        </v-btn>

                        <v-btn
                          text
                          small
                          :class="{ 'is-active': isActive.ordered_list() }"
                          @click="commands.ordered_list"
                        >
                          <v-icon>mdi-format-list-numbered</v-icon>
                        </v-btn>

                        <v-btn
                          text
                          small
                          :class="{ 'is-active': isActive.blockquote() }"
                          @click="commands.blockquote"
                        >
                          <v-icon>mdi-format-quote-open</v-icon>
                        </v-btn>

                        <v-btn
                          text
                          small
                          :class="{ 'is-active': isActive.code_block() }"
                          @click="commands.code_block"
                        >
                          <v-icon>mdi-code-json</v-icon>
                        </v-btn>

                        <v-btn text small @click="commands.horizontal_rule">
                          <v-icon>mdi-drag-horizontal-variant</v-icon>
                        </v-btn>

                        <v-btn text small @click="commands.undo">
                          <v-icon>mdi-undo</v-icon>
                        </v-btn>

                        <v-btn text small @click="commands.redo">
                          <v-icon>mdi-redo</v-icon>
                        </v-btn>

                        <v-btn text small @click="showImageMenu()">
                          <v-icon>mdi-image</v-icon>
                        </v-btn>
                        <v-dialog
                          v-model="imageMenu"
                          hide-overlay
                          max-width="400"
                        >
                          <v-card dark>
                            <v-card-title class="pb-0">
                              Enter URL
                            </v-card-title>
                            <v-card-text class="py-0">
                              <v-text-field
                                v-model="imageUrl"
                                label="url"
                                placeholder="https://"
                                hide-details="auto"
                              />
                            </v-card-text>
                            <v-card-actions class="mx-4 pb-4">
                              <v-btn
                                small
                                color="success"
                                @click="addImage(commands.image)"
                              >
                                Add image
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                        <v-btn
                          text
                          small
                          :class="{ 'is-active': isActive.link() }"
                          @click="showLinkMenu(getMarkAttrs('link'))"
                        >
                          <v-icon>mdi-link</v-icon>
                        </v-btn>
                        <v-dialog v-model="linkMenu" hide-overlay max-width="400">
                          <v-card dark>
                            <v-card-title class="pb-0">
                              Enter URL
                            </v-card-title>
                            <v-card-text class="py-0">
                              <v-text-field
                                v-model="linkUrl"
                                label="url"
                                placeholder="https://"
                                hide-details="auto"
                              />
                            </v-card-text>
                            <v-card-actions class="mx-4 pb-4">
                              <v-btn
                                small
                                color="success"
                                :class="{ 'is-active': isActive.link() }"
                                @click="setLinkUrl(commands.link, linkUrl)"
                              >
                                {{
                                  isActive.link() ? "Update Link" : "Add Link"
                                }}
                              </v-btn>
                              <v-spacer />
                              <v-btn
                                small
                                color="error"
                                @click="setLinkUrl(commands.link, null)"
                              >
                                Remove Link
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-container>
                    </editor-menu-bar>
                    <v-text-field
                      v-if="isPrimaryLanguage"
                      v-model="blogTitle"
                      solo
                      class="text-h4"
                      color="black"
                      label="Title"
                      hide-details="auto"
                    />
                    <v-text-field
                      v-if="!isPrimaryLanguage"
                      v-model="blogTitleTh"
                      solo
                      class="text-h4"
                      color="black"
                      label="Title"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
                <v-col cols="12 px-0 py-0">
                  <v-sheet
                    v-show="isPrimaryLanguage"
                    color="white"
                    elevation="1"
                    height="400"
                  >
                    <editor-content class="editor__content" :editor="editor" />
                  </v-sheet>
                  <v-sheet
                    v-show="!isPrimaryLanguage"
                    color="white"
                    elevation="1"
                    height="400"
                  >
                    <editor-content class="editor__content" :editor="editorTh" />
                  </v-sheet>
                </v-col>
                <v-row no-gutters>
                  <v-col cols="6 px-0 py-0">
                    <v-container
                      class="text-button black white--text"
                    >
                      tag
                    </v-container>
                    <v-combobox
                      v-model="blogTags"
                      class="pa-0"
                      :items="allTags"
                      :search-input.sync="search"
                      hide-selected
                      hide-details="auto"
                      multiple
                      chips
                      color="black"
                    >
                      <template v-slot:no-data>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new one
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-combobox>
                  </v-col>
                  <v-col cols="6 px-0 py-0">
                    <v-container
                      class="text-button black white--text"
                    >
                      thumbnail
                    </v-container>
                    <v-file-input
                      ref="imageFileField"
                      v-model="uploadedThumbnail"
                      prepend-icon="mdi-image"
                      color="black"
                      hide-details="auto"
                      type="file"
                    />
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-container class="grey lighten-2 py-0">
                      <v-btn text @click="lockEditor = !lockEditor">
                        {{ lockEditor ? "unlock editor" : "lock editor" }}
                        <v-icon right small>
                          {{
                            lockEditor ? "mdi-lock" : "mdi-lock-open"
                          }}
                        </v-icon>
                      </v-btn>
                    </v-container>
                  </v-col>
                  <v-col cols="12">
                    <v-sheet color="white" elevation="1" height="425">
                      <textarea
                        v-if="isPrimaryLanguage"
                        v-model="rawHtml"
                        class="rawhtml"
                        style="width: 100%; height: 100%"
                        @change="rawHtmlBufferTrigger()"
                      />
                      <textarea
                        v-if="!isPrimaryLanguage"
                        v-model="rawHtmlTh"
                        class="rawhtml"
                        style="width: 100%; height: 100%"
                        @change="rawHtmlBufferTrigger()"
                      />
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <v-row class="grey lighten-2" no-gutters>
                  <v-col cols="4" class="py-0">
                    <v-file-input
                      ref="imageFileField"
                      v-model="uploadedImage"
                      prepend-icon="mdi-image"
                      class="px-4 py-0 my-0"
                      color="black"
                      hide-details="auto"
                      type="file"
                    />
                  </v-col>
                  <v-col
                    cols="2"
                    class="px-2 py-0 text--center align-self-center"
                    align="start"
                  >
                    <v-btn
                      :disabled="uploadedImage == null ? true : false"
                      :dark="uploadedImage == null ? false : true"
                      small
                      @click="postImage()"
                    >
                      upload
                    </v-btn>
                  </v-col>
                  <v-spacer />
                  <v-col cols="2" class="px-2 py-0" align="end">
                    <v-btn icon @click="newestFirst = !newestFirst">
                      <v-icon>
                        {{
                          newestFirst
                            ? "mdi-sort-calendar-ascending"
                            : "mdi-sort-calendar-descending"
                        }}
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row class="mx-0 grey lighten-2" no-gutters>
                  <v-col
                    v-for="image in newestFirst
                      ? allImagesReversedOrder
                      : allImages"
                    :key="image.id"
                    class="pa-2"
                    cols="3"
                  >
                    <v-card dark align="center">
                      <v-card-text class="pb-0">
                        <v-img :src="image.image" height="200px" />
                        <v-text-field
                          hide-details="auto"
                          readonly
                          type="text"
                          :value="image.image"
                        />
                      </v-card-text>
                      <v-card-actions class="mx-2 pb-3">
                        <v-btn
                          color="error"
                          style="width: 80px"
                          @click="deleteImage(image.id)"
                        >
                          Delete
                        </v-btn>
                        <v-spacer />
                        <v-btn
                          :id="'image_copy_button_' + image.id"
                          color="info"
                          style="width: 80px"
                          @click="copyImageUrl(image.image, image.id)"
                          @mouseleave="changeCopyButton(image.id)"
                        >
                          Copy
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <v-container
                  class="blog__content"
                  v-html="isPrimaryLanguage ? rawHtml : rawHtmlTh"
                />
              </v-tab-item>
            </v-tabs-items>
          </v-col>
          <v-col cols="10" class="py-2" align="center">
            <v-btn dark @click="postBlog()">
              Submit
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </client-only>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Editor, EditorContent, EditorMenuBar } from '@/plugins/tiptap'
import {
  CodeBlockHighlight,
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Image
} from '@/plugins/tiptap-extensions.js'
import { hljs, python } from '@/plugins/highlight.js'
export default {
  components: {
    EditorContent,
    EditorMenuBar
  },
  data () {
    return {
      isPrimaryLanguage: true,
      blogTags: [],
      search: null,
      uploadedThumbnail: null,
      imageMenu: false,
      imageUrl: null,
      linkMenu: false,
      linkUrl: null,
      rawHtmlBuffer: '',
      rawHtmlBufferTh: '',
      blogTitle: '',
      blogTitleTh: '',
      lockEditor: false,
      uploadedImage: null,
      newestFirst: true,
      allImages: {},
      allImagesReversedOrder: {},
      blogisPosted: false,
      editor_tab: null,
      editor: process.client ? new Editor({
        extensions: [
          new CodeBlockHighlight({
            languages: {
              python
            }
          }),
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new Image()
        ],
        content: '',
        onUpdate: ({ getHTML }) => {
          if (!this.lockEditor) {
            localStorage.setItem('updatedContent', getHTML())
            this.rawHtmlBufferTrigger()
          } else {
            alert('The editor is locked.')
            this.setContent()
          }
        }
      }) : null,
      editorTh: process.client ? new Editor({
        extensions: [
          new CodeBlockHighlight({
            languages: {
              python
            }
          }),
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new Image()
        ],
        content: '',
        onUpdate: ({ getHTML }) => {
          if (!this.lockEditor) {
            localStorage.setItem('updatedContentTh', getHTML())
            this.rawHtmlBufferTrigger()
          } else {
            alert('The editor is locked.')
            this.setContent()
          }
        }
      }) : null
    }
  },
  computed: {
    ...mapGetters('blogStore', ['allTags']),
    rawHtml: {
      // getter
      get () {
        return this.rawHtmlBuffer
      },
      // setter
      set (updatedContent) {
        return localStorage.setItem('updatedContent', updatedContent)
      }
    },
    rawHtmlTh: {
      // getter
      get () {
        return this.rawHtmlBufferTh
      },
      // setter
      set (updatedContent) {
        return localStorage.setItem('updatedContentTh', updatedContent)
      }
    }
  },
  beforeMount () {
    this.getImages()
    this.getTags()
  },
  mounted () {
    this.refreshEditor()
  },
  methods: {
    ...mapActions('blogStore', ['getTags']),
    async removeProseMirrorOutline () {
      await this.$store.dispatch('sleep', 400)
      const ProseMirror = document.getElementsByClassName('ProseMirror')[0]
      ProseMirror.style.outline = 'none'
    },
    async resizeImage (classname) {
      await this.$store.dispatch('sleep', 400)
      const d = Array.from(document.getElementsByClassName(classname))
      d.forEach((d) => {
        const images = d.querySelectorAll('img')
        Array.from(images).forEach((element) => {
          element.width = 600
        })
      })
    },
    setContent () {
      this.editor.setContent(localStorage.getItem('updatedContent'))
      this.editorTh.setContent(localStorage.getItem('updatedContentTh'))
    },
    rawHtmlBufferTrigger () {
      this.rawHtmlBuffer = localStorage.getItem('updatedContent')
      this.rawHtmlBufferTh = localStorage.getItem('updatedContentTh')
    },
    async updateHighlight () {
      hljs.initHighlighting.called = false
      await this.$store.dispatch('sleep', 400)
      await hljs.initHighlighting()
    },
    showLinkMenu (attrs) {
      this.linkMenu = true
      this.linkUrl = attrs.href
    },
    setLinkUrl (command, url) {
      command({ href: url })
      this.linkMenu = false
    },
    showImageMenu () {
      this.imageMenu = true
    },
    addImage (command) {
      if (this.imageUrl !== null) {
        command({ src: this.imageUrl })
        this.imageMenu = false
        this.resizeImage('editor__content')
      }
    },
    async getImages () {
      try {
        const response = await this.$axios.get('/image/')
        this.allImages = response.data
        this.allImagesReversedOrder = [...response.data].reverse()
      } catch (error) {
        throw new Error(error)
      }
    },
    async postBlog () {
      await this.rawHtmlBufferTrigger()
      const tagObjects = []
      this.blogTags.forEach((element) => {
        tagObjects.push({ text: element })
      })
      const postData = {
        title: {
          en: this.blogTitle,
          th: this.blogTitleTh
        },
        body: {
          en: this.rawHtml,
          th: (this.rawHtmlTh && this.rawHtmlTh !== '') ? this.rawHtmlTh : '<p class="text-center text-h4">ขออภัย บทความนี้ไม่มีในภาษาไทย<p>'
        },
        tag: tagObjects,
        thumbnail: null
      }
      if (this.uploadedThumbnail) {
        try {
          const formData = new FormData()
          formData.append('image', this.uploadedThumbnail)
          const image = await this.$axios.post('/image/', formData)
          postData.thumbnail = image.data.id
        } catch (error) {
          throw new Error(error)
        }
      }
      try {
        await this.$axios.post('/blog/', postData)
        this.blogisPosted = true
        await localStorage.removeItem('updatedContent')
        await localStorage.removeItem('updatedContentTh')
        this.refreshEditor()
        this.$router.push('/blog')
      } catch (error) {
        throw new Error(error)
      }
    },
    async postImage () {
      const formData = new FormData()
      formData.append('image', this.uploadedImage)
      try {
        await this.$axios.post('/image/', formData)
        await this.getImages()
        this.uploadedImage = null
      } catch (error) {
        throw new Error(error)
      }
    },
    async deleteImage (id) {
      try {
        await this.$axios.delete(`image/${id}/`)
        await this.getImages()
      } catch (error) {
        throw new Error(error)
      }
    },
    copyImageUrl (message, id) {
      try {
        this.$copyText(message)
        const copyButton = document.getElementById(`image_copy_button_${id}`)
          .childNodes[0]
        copyButton.innerHTML = 'Copied!'
      } catch (error) {
        throw new Error(error)
      }
    },
    changeCopyButton (id) {
      const copyButton = document.getElementById(`image_copy_button_${id}`)
        .childNodes[0]
      copyButton.innerHTML = 'Copy'
    },
    async refreshEditor () {
      await this.rawHtmlBufferTrigger()
      await this.setContent()
      await this.resizeImage('editor__content')
      await this.resizeImage('blog__content')
      if (!this.blogisPosted) {
        await this.removeProseMirrorOutline()
      }
      await this.updateHighlight()
    }
  }
}
</script>

<style lang="scss" scoped>

.rawhtml {
  padding: 0.7rem 1rem;
  border-radius: 5px;
  background: #000;
  color: #fff;
  overflow-x: auto;
}
.html_preview {
  padding: 1rem;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: bold;
  display: block;
  white-space: pre-wrap;
  background-color: #f5f5f5;
  color: #bd4147;
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
}
.tag_selector {
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
