import { LocalityContactCard } from '@/components/marketing/locality-contact-card'
import { ContactInfoCards } from '@/components/marketing/contact/contact-info-cards'
import { contactPageCopy } from '@/src/tokens/contact'
import { pageLayout } from '@/src/tokens/layout'

export function ContactPageContent () {
  return (
    <section className='bg-white py-10 md:py-14'>
      <div className={pageLayout.container}>
        <div className='mt-8 grid items-start gap-8 lg:mt-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,24rem)] lg:gap-10 xl:gap-12'>
          <div className='flex flex-col gap-4'>
            <div className='max-w-2xl text-center md:text-left'>
              <h1 className='font-satoshi text-3xl font-bold tracking-tight text-gray-900 md:text-4xl'>
                {contactPageCopy.title}
              </h1>
              <p className='mt-3 text-base leading-7 text-gray-600 md:text-lg'>
                {contactPageCopy.subtitle}
              </p>
            </div>
            <ContactInfoCards />
          </div>
          <LocalityContactCard
            locationPlaceholder='Search your location here'
            showCallFallback={false}
            leadTracking='conversion'
            className='w-full self-start'
          />
        </div>
      </div>
    </section>
  )
}
