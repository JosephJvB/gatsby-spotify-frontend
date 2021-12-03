echo "aws s3 cp ~/WORKSPACE/joe/future.hellolennie/frontend/public/"
echo "s3://lennie-private-test/ --recursive"
echo "--profile joe"
echo "aws cloudfront create-invalidation"
echo "distribution-id EPRLI4PQUKWBM"
echo "--paths /*"
echo ""
echo "------"
echo ""
aws s3 cp ~/WORKSPACE/joe/spotty/frontend/public/ \
s3://lennie-private-test/ --recursive \
--profile joe
aws cloudfront create-invalidation \
--distribution-id EPRLI4PQUKWBM \
--paths "/*" \
--profile joe