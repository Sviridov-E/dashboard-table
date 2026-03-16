export const ItemPreviewCell = ({
  title,
  thumbnail,
  category,
}: {
  title: string
  thumbnail?: string
  category?: string
}) => {
  return (
    <div className='flex gap-4.5 items-center'>
      {thumbnail?.trim() ? (
        <img
          src={thumbnail}
          alt={title}
          className='size-12 rounded-xl block object-cover object-center bg-neutral-200 border border-neutral-100'
        />
      ) : (
        <div className='size-12 rounded-xl block bg-neutral-400 border border-neutral-200' />
      )}
      <div>
        <span className='text-base'>{title}</span>
        {!!category?.trim() && (
          <span className='block text-sm text-neutral-400'>
            {category}
          </span>
        )}
      </div>
    </div>
  )
}
