import { Icon } from "@iconify/react"
import { motion } from "framer-motion"
import { del } from "idb-keyval"
import { useEffect, useRef } from "react"
import Button from "~/components/ui/button"
import Input from "~/components/ui/input"
import { useImageStore } from "~/store/image-store"
import { useOptionsStore } from "~/store/options"
import type { ImageFile } from "~/types"
import NewTabHeader from "../shared/newtab-header"

const GalleryTab = () => {
  const {
    images,
    addImages,
    removeImage,
    shouldSave,
    saveImagesToDB,
    setImages,
  } = useImageStore()

  const { isBgImage, bgImageId, setBgImageId } = useOptionsStore()

  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleOnSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const newImages: ImageFile[] = Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        type: file.type,
        imageUrl: URL.createObjectURL(file),
      }))
      addImages(newImages)
    }
  }

  useEffect(() => {
    if (images.length === 0) {
      setBgImageId(null)
    }
  }, [images, setBgImageId])

  return (
    <div className="h-[86%] space-y-6">
      <NewTabHeader
        rightButtons={
          <>
            <Button
              variant="secondary"
              size="icon"
              icon="ri:image-add-fill"
              onClick={() => {
                inputRef.current?.click()
              }}
            />
            <Button
              variant="secondary"
              size="icon"
              icon="tabler:trash"
              onClick={async () => {
                await del("gallery-images").then(() => setImages([]))
              }}
            />
            <Button
              variant={shouldSave ? "accent" : "secondary"}
              size="icon"
              icon="mdi:content-save-all"
              onClick={saveImagesToDB}
            />
          </>
        }
      />

      {images?.length > 0 ? (
        <div className="flex flex-col gap-3 ">
          {images?.map((img) => (
            <motion.div
              layout
              key={img.id}
              className="group relative h-48 rounded-xl shadow-md transition-all duration-500"
              onClick={() => isBgImage && setBgImageId(img.id)}
              style={bgImageId === img.id ? { padding: "10px" } : {}}
            >
              {bgImageId === img.id && (
                <motion.div
                  layoutId="selected-image"
                  className="absolute top-0 left-0 z-10 h-full w-full rounded-xl border-4 border-foreground"
                />
              )}
              <img
                loading="lazy"
                className="size-full rounded-md object-cover"
                src={img.imageUrl}
                alt="gallary-image"
              />
              <Button
                variant="destructive"
                icon="lucide:x"
                size="icon"
                className="absolute top-2 right-3 hidden size-8 group-hover:flex"
                onClick={() => removeImage(img.name)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center text-card-foreground/40">
          <Icon icon="uil:image-block" fontSize={80} />
          <span>No image found!</span>
        </div>
      )}
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleOnSelect}
        className="hidden"
        multiple
      />
    </div>
  )
}

export default GalleryTab
