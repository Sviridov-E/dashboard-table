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
    <div className='flex items-center gap-4.5'>
      {thumbnail?.trim() ? (
        <img
          src={thumbnail}
          alt={title}
          className='block size-12 rounded-xl border border-neutral-100 bg-neutral-200 object-cover object-center'
        />
      ) : (
        <div className='block size-12 rounded-xl border border-neutral-200 bg-neutral-400' />
      )}
      <div>
        <span className='text-base'>{title}</span>
        {!!category?.trim() && (
          <span className='block text-sm text-neutral-400'>{category}</span>
        )}
      </div>
    </div>
  )
}
